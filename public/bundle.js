"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ChatBotApp extends React.Component {
  constructor() {
    super();

    _defineProperty(this, "sendMessage", message => {
      const date = new Date();
      this.setState({
        messages: [...this.state.messages, {
          message,
          date: date.toISOString(),
          user: true
        }]
      });
      this.socket.emit('QUESTION', {
        socket_id: this.state.socket_id,
        question: message
      });
    });

    _defineProperty(this, "scrollToBottom", () => {
      this.messagesEnd.scrollIntoView({
        behavior: "smooth"
      });
    });

    this.state = {
      socket_id: '',
      messages: []
    };
    this.socket = null;
  }

  componentDidMount() {
    const audio = new Audio();
    audio.src = 'http://localhost:8080/stairs.mp3';
    const socket = io();
    socket.on('connect', () => {
      this.setState({
        socket_id: socket.id
      });
      this.socket = socket;
      console.log('connected');
      socket.on('disconnect', () => {
        this.setState({
          socket_id: ''
        });
      });
      socket.on('ANSWER', data => {
        try {
          audio.currentTime = 0;
        } catch (e) {}

        audio.play();
        const {
          matched,
          date
        } = data;
        this.setState({
          messages: [...this.state.messages, {
            message: matched,
            date
          }]
        });
      });
    });
  }

  render() {
    const styles = {
      float: 'right',
      maxWidth: '90%',
      padding: '6px',
      marginBottom: '5px',
      border: '5px'
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "card bg-light",
      style: {
        width: '300px',
        position: 'fixed',
        bottom: 0,
        right: '10px'
      }
    }, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '350px',
        overflow: 'auto'
      }
    }, this.state.messages && this.state.messages.length > 0 ? this.state.messages.map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i
    }, e.user ? /*#__PURE__*/React.createElement(Left, _extends({}, e, {
      styles: styles
    })) : /*#__PURE__*/React.createElement(Right, _extends({}, e, {
      styles: styles
    })))) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        float: "left",
        clear: "both"
      },
      ref: el => {
        this.messagesEnd = el;
      }
    }))), /*#__PURE__*/React.createElement(FooterForm, {
      sendMessage: this.sendMessage
    }));
  }

}

const Header = () => /*#__PURE__*/React.createElement("div", {
  className: "card-header"
}, /*#__PURE__*/React.createElement("img", {
  alt: "user",
  style: {
    width: '30px'
  },
  src: "https://img.icons8.com/nolan/64/chatbot.png"
}), /*#__PURE__*/React.createElement("span", null, " ChatBot"));

const Left = ({
  message,
  date,
  styles
}) => /*#__PURE__*/React.createElement("div", {
  style: styles,
  className: "card bg-light"
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: '14px'
  }
}, message), /*#__PURE__*/React.createElement("small", {
  style: {
    fontSize: '11px'
  }
}, date));

const Right = ({
  message,
  date,
  styles
}) => /*#__PURE__*/React.createElement("div", {
  style: _objectSpread(_objectSpread({}, styles), {}, {
    float: 'left',
    color: '#fff'
  }),
  className: "card bg-primary"
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: '14px'
  }
}, message), /*#__PURE__*/React.createElement("small", {
  style: {
    fontSize: '11px'
  }
}, date));

const FooterForm = ({
  sendMessage
}) => {
  const [message, setMessage] = React.useState('');

  const submitHandle = e => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return /*#__PURE__*/React.createElement("form", {
    className: "card-footer",
    onSubmit: submitHandle,
    method: "post"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-inline"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    required: true,
    placeholder: "enter something here...",
    onChange: e => setMessage(e.target.value),
    value: message,
    style: {
      width: '76%'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    className: "btn btn-primary",
    value: "Send"
  })));
};

ReactDOM.render( /*#__PURE__*/React.createElement(ChatBotApp, null), document.getElementById('root'));
