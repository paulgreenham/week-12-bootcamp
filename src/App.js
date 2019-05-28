import React, {Component} from 'react'
import openSocket from 'socket.io-client'

import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      username: "",
      roomName: "",
      joinSelection: "",
      inRoom: false,
      message: "",
      socket: openSocket('/'),
      messages: [],
      rooms: []
    }    
  }

  changeName = event => this.setState({ username: event.target.value })

  changeMessage = event => this.setState({ message: event.target.value })

  changeRoomName = event => this.setState({ roomName: event.target.value })

  joinInput = event => this.setState({ joinSelection: event.target.value })

  updateMessages = () => {
    this.state.socket.on('msg-from-server', message => {
      let messageList = [...this.state.messages]
      messageList.push(message)
      this.setState({ messages: messageList })
    })
  }

  getRooms = () => {
    this.state.socket.on('rooms-to-client', rooms => {
      this.setState({ rooms: rooms })
    })
  }

  createAndJoinRoom = () => {
    this.state.socket.emit('create-room', this.state.roomName)
    this.setState({ inRoom: true })
  }

  sendMessage = () => {
    this.state.socket.emit('msg-to-server', { name: this.state.username, message: this.state.message })
  }

  joinRoom = () => {
    this.state.socket.emit('join-room', {name: this.state.username, room: this.state.joinSelection})
    this.setState({ 
      inRoom: true,
      roomName: this.state.joinSelection
    })
  }

  chooseRoom = () => {
    return (<React.Fragment>
      <select value={this.state.joinSelection} onChange={this.joinInput}>
        <option value="">Choose a currently active Room:</option>
        {this.state.rooms.map((r, i) => <option value={r} key={i}>{r}</option>)}
      </select>
      <button onClick={this.joinRoom}>Join room</button>
    </React.Fragment>)
  }

  renderRoomSelection = () => {
    this.getRooms()
    return (<div>
          {this.state.rooms.length > 0 ? this.chooseRoom() : null}
          <input type="text" placeholder="Room name" value={this.state.roomName} onChange={this.changeRoomName}/>
          <button onClick={this.createAndJoinRoom}>Create new room</button>
      </div>)
  }

  renderChats = () => {
    return (<div>
        <div>Room: {this.state.roomName} </div>
        <input type="text" value={this.state.message} onChange={this.changeMessage}/>
        <button onClick={this.sendMessage}>Post</button>
        {this.state.messages.map((m, i) => <div key={i}>{m.name}: {m.message}</div>)}
    </div>)
  }

  componentDidMount() {
    this.updateMessages()
    this.state.socket.on('new-join', message => alert(message))
  }


  render() {
    return (
      <div className="App">
        <input type="text" value={this.state.username} onChange={this.changeName} placeholder="enter your name"/>
        {this.state.inRoom ? this.renderChats() : this.renderRoomSelection()}
      </div>
    )
  }
}

export default App