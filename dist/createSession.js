'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSession;
function createSession() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      apiKey = _ref.apiKey,
      sessionId = _ref.sessionId,
      token = _ref.token,
      onStreamsUpdated = _ref.onStreamsUpdated,
      onConnect = _ref.onConnect,
      onError = _ref.onError;

  if (!apiKey) {
    throw new Error('Missing apiKey');
  }

  if (!sessionId) {
    throw new Error('Missing sessionId');
  }

  if (!token) {
    throw new Error('Missing token');
  }

  var streams = [];

  var onStreamCreated = function onStreamCreated(event) {
    var index = streams.findIndex(function (stream) {
      return stream.id === event.stream.id;
    });
    if (index < 0) {
      streams.push(event.stream);
      onStreamsUpdated(streams);
    }
  };

  var onStreamDestroyed = function onStreamDestroyed(event) {
    var index = streams.findIndex(function (stream) {
      return stream.id === event.stream.id;
    });
    if (index >= 0) {
      streams.splice(index, 1);
      onStreamsUpdated(streams);
    }
  };

  var eventHandlers = {
    streamCreated: onStreamCreated,
    streamDestroyed: onStreamDestroyed
  };

  var session = OT.initSession(apiKey, sessionId);
  session.on(eventHandlers);
  session.connect(token, function (err) {
    if (!session) {
      // Either this session has been disconnected or OTSession
      // has been unmounted so don't invoke any callbacks
      return;
    }
    if (err && typeof onError === 'function') {
      onError(err);
    } else if (!err && typeof onConnect === 'function') {
      onConnect();
    }
  });

  return {
    session: session,
    streams: streams,
    disconnect: function disconnect() {
      if (session) {
        session.off(eventHandlers);
        session.disconnect();
      }

      streams = null;
      onStreamCreated = null;
      onStreamDestroyed = null;
      eventHandlers = null;
      session = null;

      this.session = null;
      this.streams = null;
    }
  };
}