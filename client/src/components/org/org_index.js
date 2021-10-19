import React, { Component } from "react";
import Kyc from "../../contracts/Kyc.json";
import Web3 from 'web3'
import NavBar from './NavBar'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from "react-bootstrap/esm/Container";
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
import Addkyc from "./addKyc";
import Viewkyc from "./viewKyc";
import Requestkyc from "./requestKyc";
import Updatekyc from "./updateKyc";
import Deleterequest from "./deleteRequest";
import Listrequest from "./list_request";
import { NotFound } from "../404";


const {create} = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Org extends Component {
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
      let validOrg = await kyc.methods.validOrg().call({from:this.state.account});
      this.setState({validOrg})
      this.setState({loadingorg:false})
      let orgDetail = await kyc.methods.getYourOrgDetail().call({fromt:this.state.account})
      this.setState({orgDetail})
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
    window.location.reload()
  }


  handleSubmit = async(event) => {
    event.preventDefault()
    this.setState({loading:true})
    await ipfs.add(JSON.stringify(this.state.data)).then(result=>{
      this.setState({jsonHash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.p_photo).then(result=>{
      this.setState({photo_hash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.citizenship_front).then(result=>{
      this.setState({citizenship_front_hash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.citizenship_back).then(result=>{
      this.setState({citizenship_back_hash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    let added =this.state.kyc.methods.registerKYC(this.state.eth_address,this.state.jsonHash,this.state.photo_hash,this.state.citizenship_front_hash,this.state.citizenship_back_hash,true)
    .send({from:this.state.account})
    .on('transactionHash',(hash)=>{
      this.setState({loading : false})
      this.setState({added})
    }).catch(err=>{
      console.log(err.message)
    })
  }

  updateKyc = async (event) =>{
    event.preventDefault()
    this.setState({loading:true})
    await ipfs.add(JSON.stringify(this.state.data)).then(result=>{
      this.setState({jsonHash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.p_photo).then(result=>{
      this.setState({photo_hash:result.cid.toV1().toString()})
      console.log(this.state.photo_hash)
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.citizenship_front).then(result=>{
      this.setState({citizenship_front_hash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.citizenship_back).then(result=>{
      this.setState({citizenship_back_hash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    let added =this.state.kyc.methods.updateKYC(this.state.eth_address,this.state.jsonHash,this.state.photo_hash,this.state.citizenship_front_hash,this.state.citizenship_back_hash,true)
    .send({from:this.state.account})
    .on('transactionHash',(hash)=>{
      this.setState({loading : false})
      this.setState({added})
    }).catch(err=>{
      console.log(err.message)
    })
  }

  handleJsonChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value
    this.setState({data:{
      ...this.state.data,
      [name]:value
    }})
  }
  handleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value
    this.setState({[name]:value})
  }
  captureFile = (event) => {
    const name = event.target.name
    const file = event.target.files[0]
    this.setState({[name]:file})
  }

  onRequest = (event) =>{
    event.preventDefault();
    this.setState({loading:true})
    let req = this.state.kyc.methods.requestKYC(this.state.eth_address)
    .send({from:this.state.account})
    .on('transactionHash',(hash)=>{
      this.setState({loading : false})
      this.setState({req})
      console.log(req)
    }).catch(err=>{
      console.log(err.message)
    })
  }

  onDeleteRequest =  (event)=>{
    event.preventDefault()
    this.setState({loading:true})
    let del =this.state.kyc.methods.deleteRequestOrg(this.state.req_count)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({
         loading:false
       })
        this.setState({del})
      }).catch(error=>{
        console.log(error.message)
      })
  }



  constructor(props){
    super(props);
    this.state={
      account : '',
      kyc :{},
      orgDetail : '',
      validOrg: false,
      loading:false,
      loadingorg:true,
      data : {},
      jsonHash : '',
      photo_hash :'',
      citizenship_front_hash : '',
      citizenship_back_hash:'',
      p_photo : '',
      citizenship_front :'',
      citizenship_back: '',
      eth_address:'',
      added:'',
      req:'',
      req_count:'',
      del:'',
      custDetail:''
    }
  }

  render() {
    const validOrg = this.state.validOrg
    let content
    if(this.state.loadingorg){
      content = <Container style={{textAlign: "center",paddingTop:"30px"}}><h2>Loading....</h2></Container>
    }
    else{
      content = validOrg ? 
      <>
        <NavBar account={this.state.account} />
        <Switch>
          <Route exact path="/Organization/">
          </Route>
          <Route exact path="/Organization/add">
            <Addkyc 
            added={this.state.added}
            loading={this.state.loading}
            captureFile={this.captureFile}
            handleSubmit={this.handleSubmit} 
            handleChange={this.handleChange} 
            handleJsonChange={this.handleJsonChange}/>
          </Route>
          <Route exact path="/Organization/view">
            <Viewkyc account={this.state.account} kyc={this.state.kyc}/>
          </Route>
          <Route exact path="/Organization/request">
            <Requestkyc
            req={this.state.req}
            loading={this.state.loading}
            onRequest={this.onRequest}
            handleChange  ={this.handleChange} />
          </Route>
          <Route exact path="/Organization/update/">
            <Updatekyc
            added={this.state.added}
            loading={this.state.loading}
            captureFile={this.captureFile}
            updateKyc={this.updateKyc} 
            handleChange={this.handleChange} 
            handleJsonChange={this.handleJsonChange} />
          </Route>
          <Route exact path="/Organization/delete">
            <Deleterequest
            del={this.state.del}
            loading={this.state.loading}
            onDeleteRequest={this.onDeleteRequest}
            handleChange={this.handleChange} />
          </Route>
          <Route exact path="/Organization/list">
            <Listrequest
            kyc={this.state.kyc}
            account={this.state.account}
            handleChange={this.handleChange}
            onDeleteRequest={this.onDeleteRequest} />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </>      
      :
      <Container style={{textAlign: "center",paddingTop:"30px"}}>
        <h2>Only Organization added by admin are allowed</h2>
        <p>Contact Admin if you want to gain access..</p>
      </Container>
    }
    return (
      <Router>
        {content}
      </Router>
      
      
    );
  }
}

export default Org;
