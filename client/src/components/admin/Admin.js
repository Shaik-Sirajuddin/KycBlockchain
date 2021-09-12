import React, { Component } from "react";
import Kyc from "../../contracts/Kyc.json";
import Web3 from 'web3'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './NavBar'
import Vieworg from './view_org'
import Removeorg from './remove_org'
import Addorg from './add_org'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import Container from "react-bootstrap/esm/Container";

export default class Admin extends Component {
  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    document.title = this.props.title
  }

  async componentWillUnmount(){
    await window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
  }

  async loadBlockchainData() {
    //Declare Web3
    const ethereum = window.ethereum
    let web3 = new Web3(window.ethereum)
    //Load account
    window.ethereum.on('accountsChanged',this.handleAccountsChanged)
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    this.setState({account : accounts[0]})
    //Network ID
    const networkId = await ethereum.request({ method: 'net_version' })
    const networkData = Kyc.networks[networkId]
    //IF got connection, get data from contracts
    if(networkData){
      const kyc = new web3.eth.Contract(Kyc.abi, networkData.address)
      this.setState({kyc});
      let validAdmin = await kyc.methods.validAdmin().call({from:this.state.account});
      this.setState({validAdmin})
      this.setState({loading:false})
    }else{
      window.alert('KYC contract not deployed on this network')
    }
      

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  handleAccountsChanged = (accounts) =>{
    this.setState({account : accounts[0]})
  }

  handleSubmit = (event) => {
    this.setState({loading:true})
    let added=this.state.kyc.methods.addOrg(this.state.orgName,this.state.ethAddress)
    .send({from:this.state.account})
    .on('transactionHash', (hash)=>{
      this.setState({loading : false})
      this.setState({added})
    })
    event.preventDefault();
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
        [name]:value
    })
  }

  viewOrg = (event) => {
      let name = this.state.kyc.methods.viewOrg(this.state.address).call({from:this.state.account})
      name.then(result=>{
          this.setState({name:result});
        } )
      
      event.preventDefault();
  }

  removeOrg = (event) =>{
      this.setState({loading:true})
      let removed = this.state.kyc.methods.removeOrg(this.state.address)
      .send({from:this.state.account})
      .on('transactionHash', (hash)=>{
        this.setState({loading : false})
        this.setState({removed})
      })
      event.preventDefault();
  }

  
 
  constructor(props){
    super(props);
    this.state={
      validAdmin:'false',
      orgName:'',
      ethAddress:'',
      account:'',
      kyc:{},
      address:'',
      name:'',
      added: '',
      removed:'',
      loading:'true'
    }
  }

  render() {
    const validAdmin = this.state.validAdmin
    let content 
    if(this.state.loading){
      content = <Container style={{textAlign: "center",paddingTop:"30px"}}><h2>Loading....</h2></Container>
    }else{
      content = validAdmin? 
      <NavBar account={this.state.account}/>:
      <Container style={{textAlign: "center",paddingTop:"30px"}}><h2>Only Admin are allowed</h2></Container>
    }
    return ( 
      <Router>
      {content}
        
      <Switch>
        <Route exact path="/admin/add">
          <Addorg loading={this.state.loading} added={this.state.added} orgName={this.state.orgName} ethAddress={this.state.ethAddress} handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
        </Route>
        <Route exact path='/admin/view'>
          <Vieworg name={this.state.name} address={this.state.address} viewOrg={this.viewOrg} handleChange={this.handleChange}/>
        </Route>
        <Route exact path="/admin/remove">
          <Removeorg loading={this.state.loading} removed={this.state.removed} address={this.state.address} removeOrg={this.removeOrg} handleChange={this.handleChange}/>
        </Route>
      </Switch>
    </Router>
    );

    
  }
  
}


