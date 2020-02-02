import React, { Component} from 'react';

export default class TestExpense extends Component {
    constructor(){
        super();
        this.state = {
            header: 'Balance',
            totalAmount: 35987,
            totalIncome: 42000,
            totalSpendings: 6013,
            showPopup: false,
            addSelection: 'Income',
            date: new Date().toLocaleString().split(',')[0],
            listItems: [
                {
                    type: 'Spending',
                    amount: 1500,
                    itemDetail: 'Groceries from Albert'
                },
                {
                    type: 'income',
                    amount: 42000,
                    itemDetail: 'Salary from work'
                },
                {
                    type: 'Spending',
                    amount: 1500,
                    itemDetail: 'New shirt from ZARA'
                },
                {
                    type: 'Spending',
                    amount: 13,
                    itemDetail: 'Icecream - It was hot outside'
                }
            ]
        }
    }

    componentWillMount(){
        this.amountCalc();
        this.localStorageUpdate();
    }

    amountCalc(){
        let newState = this.state.listItems;
        var totalSpendings = 0, totalIncome = 0, totalAmount = 0;
        newState.forEach((itemValue, index, arr) => {
            if(itemValue.type === 'Spending'){
                totalSpendings = Number(itemValue.amount)+Number(totalSpendings);
            } else {
                totalIncome = Number(itemValue.amount)+totalIncome;
            }
        })
        totalAmount = totalIncome - totalSpendings;
        this.setState({ totalAmount: totalAmount, totalSpendings: totalSpendings, totalIncome: totalIncome },
            this.localStorageUpdate()
        );             
    }

    localStorageUpdate(){
        setTimeout(() => { 
            var stateData = this.state;
            var listItems = [];
            localStorage.clear();    
            for( var list of stateData.listItems){
                let str = `type : ${list.type}, amount : ${list.amount}, itemDetail : ${list.itemDetail}`
                listItems.push(str);
            }  
            localStorage.setItem(`listItems`, `{ ${listItems.toLocaleString()} }`);
            localStorage.setItem(`totalIncome`, `${this.state.totalIncome}`);
            localStorage.setItem(`totalSpendings`, `${this.state.totalSpendings}`);
            localStorage.setItem(`totalAmount`, `${this.state.totalAmount}`);
        }, 100)
    }

    deleteRow(index){
        let newState = this.state.listItems;
        newState.splice(index,1);
        this.setState({listItems: newState});
        this.amountCalc();
        this.localStorageUpdate();
    }

    amountChange(event){
        this.setState({textAmount: event.target.value});
    }

    submitTransaction(){
        var newObj = {
            type: this.state.addSelection,
            amount: this.state.textAmount,
            itemDetail: this.state.addSelection === 'Spending' ? 'Debit' : 'Credit'
        }
        var newState = this.state.listItems;
        console.log(this.state.textAmount)
        if(this.state.textAmount !==  undefined ){
            newState.push(newObj);
            this.setState({ ...newState, showPopup: false },                        
                this.amountCalc()
            )
        }
    }

    addBtnClick(type){
        this.setState({ addSelection : type, showPopup: true, textAmount: undefined });
    }

    closPopup(){
        this.setState({showPopup: false})
    }

  render() {
    return (
        <div>            
            { this.state.showPopup ? ( <div className="popupOuter"></div> ) : null }        
            {
                this.state.showPopup ? (                    
                    <div className="popupCont">   
                        <img className="cursor closeSpan" onClick={this.closPopup.bind(this)} src={'https://img.icons8.com/material-rounded/24/000000/close-window.png'} />
                        <div className="paddingBottom-12"><b>TYPE:</b> {this.state.addSelection}</div>
                        <div className="paddingBottom-12"><b>Transaction:</b> {this.state.addSelection === 'Spending' ? 'Debit' : 'Credit'}</div>
                        <div className="">
                            <b>Amount:</b> <input className="textAmount" id="textInput" value={this.state.textAmount} onChange={this.amountChange.bind(this)} type="number" />
                        </div>
                        <input type="button" onClick={this.submitTransaction.bind(this)} className="btn bgCredit font-12 addSubmit" value="SUBMIT"/>
                    </div>                    
                ) : null
            }
        <div className="expenseCont">
            <div className="header">
                <div className="paddingLeft-12 font-10 bold colorGrey">{this.state.header}</div> 
                <div className="paddingLeft-12 font-18 bold">{this.state.totalAmount} CZK</div>
                <div className="tableRow">
                    <div className="paddingBottom-12 paddingLeft-12 font-12 bold colorCredit tableChild">Income: {this.state.totalIncome} Kc</div> 
                    <div className="paddingBottom-12 font-12 bold colorDebit paddingLeft-12 tableChild">Spendings: {this.state.totalSpendings} Kc</div> 
                </div>
            </div>
        </div>
            <div className="detailsSection paddingLeft-12">
                <table>
                   { this.state.listItems.map((eachValue, index) => {
                        return <tr>
                            <td>
                                <div className="font-10">{this.state.date}</div>
                                <div className={`bold ${eachValue.type === 'Spending' ? 'colorDebit' : 'colorCredit'}`}>
                                    {eachValue.amount} Kc
                                </div>
                            </td>
                            <td>{eachValue.itemDetail}</td>
                            <td>
                                <img onClick={this.deleteRow.bind(this, index)} className="trashImg cursor" src={'https://img.icons8.com/ios-filled/50/000000/delete.png'} />
                            </td>
                        </tr>                     
                   })
                   }
                </table>
            </div>
            <div className="textCenter">
                <input type="button" className="btn bgCredit font-12" value="Add Income" onClick={this.addBtnClick.bind(this, 'Income')}/>
                <input type="button" className="btn bgDebit font-12" value="Add Spending" onClick={this.addBtnClick.bind(this, 'Spending')} />
            </div>
         </div>
    )
  }
}