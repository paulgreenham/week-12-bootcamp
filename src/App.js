import React, {Component} from 'react'
import openSocket from 'socket.io-client'

import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      username: "",
      message: "",
      socket: openSocket('/'),
      messages: []
    }    
  }

  changeName = event => this.setState({ username: event.target.value })

  changeMessage = event => this.setState({ message: event.target.value })

  updateMessages = () => {
    this.state.socket.on('msg-from-server', message => {
      let messageList = [...this.state.messages]
      messageList.push(message)
      this.setState({ messages: messageList })
    })
  }

  sendMessage = () => {
    this.state.socket.emit('msg-to-server', { name: this.state.username, message: this.state.message })
  }

  componentDidMount() {
    this.updateMessages()
  }


  render() {
    return (
      <div className="App">
        <input type="text" value={this.state.username} onChange={this.changeName} placeholder="enter your name"/>
        <input type="text" value={this.state.message} onChange={this.changeMessage}/>
        <button onClick={this.sendMessage}>Post</button>
        {this.state.messages.map((m, i) => <div key={i}>{m.name}: {m.message}</div>)}
      </div>
    )
  }
}

export default App