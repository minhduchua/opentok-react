'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = OTStreams;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function OTStreams(props) {
  if (!props.session) {
    return _react2.default.createElement('div', null);
  }

  var child = _react.Children.only(props.children);

  var childrenWithProps = Array.isArray(props.streams) ? props.streams.map(function (stream, i) {
    return child ? (0, _react.cloneElement)(child, {
      session: props.session,
      stream: stream,
      containerStyle: props.subContainerStyles.length > i ? props.subContainerStyles[i] : {},
      key: stream.id
    }) : child;
  }) : null;

  return _react2.default.createElement(
    'div',
    { style: props.style },
    childrenWithProps
  );
}

OTStreams.propTypes = {
  children: _propTypes2.default.element.isRequired,
  session: _propTypes2.default.shape({
    publish: _propTypes2.default.func,
    subscribe: _propTypes2.default.func
  }),
  streams: _propTypes2.default.arrayOf(_propTypes2.default.object),
  subContainerStyles: _propTypes2.default.arrayOf(_propTypes2.default.object),
  style: _propTypes2.default.object // eslint-disable-line react/forbid-prop-types
};

OTStreams.defaultProps = {
  session: null,
  streams: [],
  subContainerStyles: [],
  style: {}
};