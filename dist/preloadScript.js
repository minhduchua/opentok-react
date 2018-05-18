'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = preloadScript;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDisplayName = require('react-display-name');

var _reactDisplayName2 = _interopRequireDefault(_reactDisplayName);

var _scriptjs = require('scriptjs');

var _scriptjs2 = _interopRequireDefault(_scriptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_SCRIPT_URL = 'https://static.opentok.com/v2/js/opentok.min.js';

/*
This higher-order component will load the OpenTok client thru a script tag.
It will render its inner component only when the OpenTok client has loaded.
In the meantime, it will render a loading element chosen by the developer.
*/
function preloadScript(InnerComponent) {
  var PreloadScript = function (_Component) {
    _inherits(PreloadScript, _Component);

    function PreloadScript(props) {
      _classCallCheck(this, PreloadScript);

      var _this = _possibleConstructorReturn(this, (PreloadScript.__proto__ || Object.getPrototypeOf(PreloadScript)).call(this, props));

      _this.onScriptLoad = function () {
        if (_this.isPresent) {
          _this.setState({ scriptLoaded: true });
        }
      };

      _this.state = {
        scriptLoaded: typeof OT !== 'undefined'
      };
      _this.isPresent = false;
      return _this;
    }

    _createClass(PreloadScript, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.isPresent = true;

        if (this.scriptLoading || this.state.scriptLoaded) {
          return;
        }

        this.scriptLoading = true;

        var scriptUrl = this.props.opentokClientUrl;
        (0, _scriptjs2.default)(scriptUrl, this.onScriptLoad);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.isPresent = false;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            opentokClientUrl = _props.opentokClientUrl,
            loadingDelegate = _props.loadingDelegate,
            restProps = _objectWithoutProperties(_props, ['opentokClientUrl', 'loadingDelegate']);

        if (this.state.scriptLoaded) {
          return _react2.default.createElement(InnerComponent, restProps);
        }

        return loadingDelegate;
      }
    }]);

    return PreloadScript;
  }(_react.Component);

  PreloadScript.displayName = 'preloadScript(' + (0, _reactDisplayName2.default)(InnerComponent) + ')';
  PreloadScript.propTypes = {
    opentokClientUrl: _propTypes2.default.string,
    loadingDelegate: _propTypes2.default.node
  };
  PreloadScript.defaultProps = {
    opentokClientUrl: DEFAULT_SCRIPT_URL,
    loadingDelegate: _react2.default.createElement('div', null)
  };

  return PreloadScript;
}