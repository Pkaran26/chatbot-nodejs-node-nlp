class ChatBotApp extends React.Component {
  constructor(){
    super()
    this.state = {
      socket_id: '',
      messages: []
    }
    this.socket = null
  }
  componentDidMount(){
    const audio = new Audio()
    audio.src = 'http://localhost:8080/stairs.mp3'

    const socket = io();
    socket.on('connect', () => {
      this.setState({ socket_id: socket.id })
      this.socket = socket
      console.log('connected');
      socket.on('disconnect', () => {
        this.setState({ socket_id: '' })
      });

      socket.on('ANSWER', (data) => {
        try {
          audio.currentTime = 0
        } catch (e) {}
        audio.play()
        const { matched, date } = data
        this.setState({
          messages: [...this.state.messages, { message: matched, date } ]
        })
      });
    });
  }

  sendMessage = (message)=>{
    const date = new Date()
    this.setState({
      messages: [...this.state.messages, { message, date: date.toISOString(), user: true } ]
    })

    this.socket.emit('QUESTION', {
      socket_id: this.state.socket_id,
      question: message
    });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const styles = { float: 'right', maxWidth: '90%', padding: '6px', marginBottom: '5px', border: '5px' }

    return (
      <div className="card bg-light" style={{ width: '300px' ,position: 'fixed', bottom: 0, right: '10px' }}>
        <Header />
        <div className="card-body">
          <div style={{ height: '350px', overflow: 'auto' }}>
            { this.state.messages && this.state.messages.length>0?
              this.state.messages.map((e, i)=>(
                <div key={ i }>
                  { e.user?
                    <Left {...e} styles={ styles }/>
                    :
                    <Right {...e} styles={ styles }/>
                  }
                </div>
              ))
            :null }
            <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}></div>
          </div>
        </div>
        <FooterForm sendMessage={ this.sendMessage }/>
      </div>
    )
  }
}

const Header = ()=>(
  <div className="card-header">
    <img alt="user" style={{ width: '30px' }} src="https://img.icons8.com/nolan/64/chatbot.png" />
    <span> ChatBot</span>
  </div>
)

const Left = ({ message, date, styles })=>(
  <div style={ styles } className="card bg-light">
    <span style={{ fontSize: '14px' }}>{ message }</span>
    <small style={{ fontSize: '11px' }}>{ date }</small>
  </div>
)

const Right = ({ message, date, styles })=>(
  <div style={{ ...styles, float: 'left', color: '#fff' }} className="card bg-primary">
    <span style={{ fontSize: '14px' }}>{ message }</span>
    <small style={{ fontSize: '11px' }}>{ date }</small>
  </div>
)

const FooterForm = ({ sendMessage })=>{
  const [message, setMessage] = React.useState('')

  const submitHandle = (e)=>{
    e.preventDefault()
    sendMessage(message)
    setMessage('')
  }

  return(
    <form className="card-footer" onSubmit={ submitHandle } method="post">
      <div className="form-inline">
        <input
          type="text"
          className="form-control"
          required={ true }
          placeholder="enter something here..."
          onChange={ (e)=> setMessage(e.target.value) }
          value={ message }
          style={{     width: '76%' }}
        />
        <input
          type="submit"
          className="btn btn-primary"
          value="Send"
        />
      </div>
    </form>
  )
}




ReactDOM.render(<ChatBotApp />, document.getElementById('root'))
