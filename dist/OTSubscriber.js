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

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OTSubscriber = function (_Component) {
  _inherits(OTSubscriber, _Component);

  function OTSubscriber(props) {
    _classCallCheck(this, OTSubscriber);

    var _this = _possibleConstructorReturn(this, (OTSubscriber.__proto__ || Object.getPrototypeOf(OTSubscriber)).call(this, props));

    _this.state = {
      subscriber: null
    };
    return _this;
  }

  _createClass(OTSubscriber, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createSubscriber();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      var cast = function cast(value, Type, defaultValue) {
        return value === undefined ? defaultValue : Type(value);
      };

      var updateSubscriberProperty = function updateSubscriberProperty(key) {
        var previous = cast(prevProps.properties[key], Boolean, true);
        var current = cast(_this2.props.properties[key], Boolean, true);
        if (previous !== current) {
          _this2.state.subscriber[key](current);
        }
      };

      updateSubscriberProperty('subscribeToAudio');
      updateSubscriberProperty('subscribeToVideo');

      // manage height and width properties evolution
      if (this.props.containerStyle.width && this.props.containerStyle.height) {
        var container = document.getElementById(this.containerId);
        container.style.width = this.props.containerStyle.width;
        container.style.height = this.props.containerStyle.height;
      }

      if (this.props.session !== prevProps.session || this.props.stream !== prevProps.stream) {
        this.destroySubscriber(prevProps.session);
        this.createSubscriber();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.destroySubscriber();
    }
  }, {
    key: 'getSubscriber',
    value: function getSubscriber() {
      return this.state.subscriber;
    }
  }, {
    key: 'createSubscriber',
    value: function createSubscriber() {
      var _this3 = this;

      if (!this.props.session || !this.props.stream) {
        this.setState({ subscriber: null });
        return;
      }

      this.containerId = (0, _uuid2.default)();
      var containerId = this.containerId;

      var container = document.createElement('div');
      container.setAttribute('class', 'OTSubscriberContainer');
      container.setAttribute('id', containerId);
      this.node.appendChild(container);

      this.subscriberId = (0, _uuid2.default)();
      var subscriberId = this.subscriberId;


      var subscriber = this.props.session.subscribe(this.props.stream, container, this.props.properties, function (err) {
        if (subscriberId !== _this3.subscriberId) {
          // Either this subscriber has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }
        if (err && typeof _this3.props.onError === 'function') {
          _this3.props.onError(err, _this3.props.stream);
        } else if (!err && typeof _this3.props.onSubscribe === 'function') {
          _this3.props.onSubscribe(_this3.props.stream);
        }
      });

      if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
        subscriber.on(this.props.eventHandlers);
      }

      this.setState({ subscriber: subscriber });
    }
  }, {
    key: 'destroySubscriber',
    value: function destroySubscriber() {
      var _this4 = this;

      var session = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.session;

      delete this.subscriberId;

      if (this.state.subscriber) {
        if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
          this.state.subscriber.once('destroyed', function () {
            _this4.state.subscriber.off(_this4.props.eventHandlers);
          });
        }

        if (session) {
          session.unsubscribe(this.state.subscriber);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement('div', { ref: function ref(node) {
          return _this5.node = node;
        } });
    }
  }]);

  return OTSubscriber;
}(_react.Component);

exports.default = OTSubscriber;


OTSubscriber.propTypes = {
  stream: _propTypes2.default.shape({
    streamId: _propTypes2.default.string
  }),
  session: _propTypes2.default.shape({
    subscribe: _propTypes2.default.func,
    unsubscribe: _propTypes2.default.func
  }),
  properties: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
  containerStyle: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
  eventHandlers: _propTypes2.default.objectOf(_propTypes2.default.func),
  onSubscribe: _propTypes2.default.func,
  onError: _propTypes2.default.func
};

OTSubscriber.defaultProps = {
  stream: null,
  session: null,
  properties: {},
  containerStyle: {},
  eventHandlers: null,
  onSubscribe: null,
  onError: null
};