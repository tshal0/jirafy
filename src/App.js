import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDropzone from 'react-dropzone';
import axios from 'axios';
import { OAuth } from "oauth";
import { fs } from "fs";
import {BrowserRouter as Router,
	Route,
	Link,
	Redirect,
	withRouter } from "react-router-dom";
// import { OAuth2 } from "atlassian-oauth2";
var JIRA_BASE_URL = "http://localhost:8080" 



class App extends Component {

	constructor(props){
		super(props);
		this.state={
			store:[]
		}
	}

	componentDidMount(){
	// axios.get('https://randomuser.me/api/?results=10&inc=name,registered&nat=fr')
	// .then(json => console.log(json))
	}

	authenticateUser(){
		var base_url = JIRA_BASE_URL;
		var oa = new OAuth(
			base_url + "/plugins/servlet/oauth/request-token", 
			base_url + "/plugins/servlet/oauth/access-token", 
			"mykey", fs.readFileSync("jira.pem", "utf8"), "1.0",     "http://localhost:3000/jira/callback", "RSA-SHA1"); 
		oa.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
			if (error) {
    
				console.log(error.data);
			} else {
				this.setState({
					session: {
						oa: oa,
						oauth_token: oauthToken,
						oauth_token_secret: oauthTokenSecret
					}
				})

				axios.get(base_url + "/plugins/servlet/oauth/authorize?oauth_token=" + oauthToken).then((res) => {
					console.log(res);
				});
			 }
		});
	}

	postIssues(){
		axios.post('http://localhost:8080/rest/api/2/issue', {
			"fields": {
			"project": {
				"id": "10000"
			},
			"summary": "something's wrong",
			"issuetype": {
				"name": "Bug"
			},
			"labels": [
				"bugfix",
				"blitz_test"
			],
			"description": "DESC"
			}
		},
		{
			auth: {
				username: "twshal",
				password: "fr33zing"
			},
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			}
		})
		.then(function (response) {
		//   resultElement.innerHTML = generateSuccessHTMLOutput(response);
		})
		.catch(function (error) {
		//   resultElement.innerHTML = generateErrorHTMLOutput(error);
		});
	}

  onDrop = (files) => {
    // POST to a test endpoint for demo purposes
    // const req = request.post('https://httpbin.org/post');

    // files.forEach(file => {
    //   req.attach(file.name, file);
    // });

    // req.end();
  }


  render() {
    return (
	<Router>
      <div className="App"> 
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ReactDropzone onDrop={this.onDrop}>
          Excel file here
        </ReactDropzone>
		<button onClick={this.authenticateUser}>Test</button>
		<Route path="/jira" ></Route>
		<Route path="/jira/callback"></Route>
      </div>
	  </Router>
    );
  }
}

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectToReferrer: false
		};
	}

	login = () => {

	}
	
	render() {
		const { from } = this.props.location.state || { from: { pathname: "/" } };
		const { redirectToReferrer } = this.state;

		if (redirectToReferrer) {
			return <Redirect to={from} />;
		}

		return (
			<div>
				<p>You must log in to view the page at {from.pathname}</p>
				<button onClick={this.login}>Log in</button>
			</div>
		);
	}
}

export default App;
