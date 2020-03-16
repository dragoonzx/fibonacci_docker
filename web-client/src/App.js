import React, { Component } from 'react'

import { Layout } from 'antd';
import { InputNumber } from 'antd';
import { Button } from 'antd';

const { Header, Sider, Content } = Layout;


class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			message: 55,
			value: 10,
			history: {}
		}
	}

	onChange = (value) => {
		this.setState({value})
	}

	getResult = () => {
		fetch(`http://localhost:5000/getResult?num=${this.state.value}`)
			.then(response => response.json())
			.then(data => {
				this.setState({ message: data.result })
			})
	}

	getHistory = () => {
		fetch(`http://localhost:5000/getHistory`)
			.then(response => response.json())
			.then(data => {
				this.setState({ history: data.splice(data.length - 5, data.length) })
			})
	}

	render() {
		console.log(this.state.history)
		return (
			<Layout>
				<Header>Fibonacci Test</Header>
				<Layout>
					<Content>
						<h1>Input number and get that number-th of Fibonacci sequence:</h1>
						<InputNumber min={1} defaultValue={10} onChange={this.onChange} />
						<Button onClick={this.getResult} type="primary">Get result</Button>
						<h1>Your result: {this.state.message}</h1>
					</Content>
					<Sider>
						<h1>Get history of last 5 requests</h1>
						<Button onClick={this.getHistory}>Get history</Button>
						<table>
							<tr>
								<td>time</td>
								<td>number</td>
								<td>result</td>
								<td>ip</td>
							</tr>
						{this.state.history.length ? this.state.history.map((data,index)=>
							{
								let time = new Date(Date.parse(data.createdAt.split('T').join(' ').split('Z')[0])).toLocaleString() + 'GMT'
								return (
										<tr key={index}>
											<td>{time}</td>
											<td>{data.number}</td>
											<td>{data.result}</td>
											<td>{data.ip}</td>
										</tr>
								)
							})
						: ''}
						</table>
					</Sider>
				</Layout>
			</Layout>
		)
	}
}

export default App
