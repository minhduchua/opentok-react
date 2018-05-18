'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _once = require('lodash/once');

var _once2 = _interopRequireDefault(_once);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OTPublisher = function (_Component) {
  _inherits(OTPublisher, _Component);

  function OTPublisher(props) {
    _classCallCheck(this, OTPublisher);

    var _this = _possibleConstructorReturn(this, (OTPublisher.__proto__ || Object.getPrototypeOf(OTPublisher)).call(this, props));

    _this.sessionConnectedHandler = function () {
      _this.publishToSession(_this.state.publisher);
    };

    _this.streamCreatedHandler = function (event) {
      _this.setState({ lastStreamId: event.stream.id });
    };

    _this.state = {
      publisher: null,
      lastStreamId: ''
    };
    return _this;
  }

  _createClass(OTPublisher, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createPublisher();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      var useDefault = function useDefault(value, defaultValue) {
        return value === undefined ? defaultValue : value;
      };

      var shouldUpdate = function shouldUpdate(key, defaultValue) {
        var previous = useDefault(prevProps.properties[key], defaultValue);
        var current = useDefault(_this2.props.properties[key], defaultValue);
        return previous !== current;
      };

      var updatePublisherProperty = function updatePublisherProperty(key, defaultValue) {
        if (shouldUpdate(key, defaultValue)) {
          var value = useDefault(_this2.props.properties[key], defaultValue);
          _this2.state.publisher[key](value);
        }
      };

      if (shouldUpdate('videoSource', undefined)) {
        this.destroyPublisher();
        this.createPublisher();
        return;
      }

      // manage height and width properties evolution
      if (this.props.properties.width && this.props.properties.height) {
        var container = document.getElementById(this.containerId);
        container.style.width = this.props.properties.width;
        container.style.height = this.props.properties.height;
      }

      updatePublisherProperty('publishAudio', true);
      updatePublisherProperty('publishVideo', true);

      if (this.props.session !== prevProps.session) {
        this.destroyPublisher(prevProps.session);
        this.createPublisher();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.session) {
        this.props.session.off('sessionConnected', this.sessionConnectedHandler);
      }

      this.destroyPublisher();
    }
  }, {
    key: 'getPublisher',
    value: function getPublisher() {
      return this.state.publisher;
    }
  }, {
    key: 'destroyPublisher',
    value: function destroyPublisher() {
      var _this3 = this;

      var session = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.session;

      delete this.publisherId;

      if (this.state.publisher) {
        this.state.publisher.off('streamCreated', this.streamCreatedHandler);

        if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
          this.state.publisher.once('destroyed', function () {
            _this3.state.publisher.off(_this3.props.eventHandlers);
          });
        }

        if (session) {
          session.unpublish(this.state.publisher);
        }
        this.state.publisher.destroy();
      }
    }
  }, {
    key: 'publishToSession',
    value: function publishToSession(publisher) {
      var _this4 = this;

      var publisherId = this.publisherId;


      this.props.session.publish(publisher, function (err) {
        if (publisherId !== _this4.publisherId) {
          // Either this publisher has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }
        if (err) {
          _this4.errorHandler(err);
        } else if (typeof _this4.props.onPublish === 'function') {
          _this4.props.onPublish(publisher.stream);
        }
      });
    }
  }, {
    key: 'createPublisher',
    value: function createPublisher() {
      var _this5 = this;

      if (!this.props.session) {
        this.setState({ publisher: null, lastStreamId: '' });
        return;
      }

      var properties = this.props.properties || {};
      var container = void 0;

      this.containerId = (0, _uuid2.default)();
      var containerId = this.containerId;


      if (properties.insertDefaultUI !== false) {
        container = document.createElement('div');
        container.setAttribute('class', 'OTPublisherContainer');
        container.setAttribute('id', containerId);
        this.node.appendChild(container);
      }

      this.publisherId = (0, _uuid2.default)();
      var publisherId = this.publisherId;


      this.errorHandler = (0, _once2.default)(function (err) {
        if (publisherId !== _this5.publisherId) {
          // Either this publisher has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }
        if (typeof _this5.props.onError === 'function') {
          _this5.props.onError(err);
        }
      });

      var publisher = OT.initPublisher(container, properties, function (err) {
        if (publisherId !== _this5.publisherId) {
          // Either this publisher has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }
        if (err) {
          _this5.errorHandler(err);
        } else if (typeof _this5.props.onInit === 'function') {
          _this5.props.onInit();
        }
      });
      publisher.on('streamCreated', this.streamCreatedHandler);

      if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
        publisher.on(this.props.eventHandlers);
      }

      if (this.props.session.connection) {
        this.publishToSession(publisher);
      } else {
        this.props.session.once('sessionConnected', this.sessionConnectedHandler);
      }

      this.setState({ publisher: publisher, lastStreamId: '' });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      return _react2.default.createElement('div', { style: this.props.style, ref: function ref(node) {
          return _this6.node = node;
        } });
    }
  }]);

  return OTPublisher;
}(_react.Component);

exports.default = OTPublisher;


OTPublisher.propTypes = {
  session: _propTypes2.default.shape({
    connection: _propTypes2.default.shape({
      connectionId: _propTypes2.default.string
    }),
    once: _propTypes2.default.func,
    off: _propTypes2.default.func,
    publish: _propTypes2.default.func,
    unpublish: _propTypes2.default.func
  }),
  properties: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
  eventHandlers: _propTypes2.default.objectOf(_propTypes2.default.func),
  onInit: _propTypes2.default.func,
  onPublish: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  style: _propTypes2.default.object // eslint-disable-line react/forbid-prop-types
};

OTPublisher.defaultProps = {
  session: null,
  properties: {},
  eventHandlers: null,
  onInit: null,
  onPublish: null,
  onError: null,
  style: {}
};