/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect } from "react";
import { URL, Proposal, ProposalByStatus } from "../const";
import axios from "axios";
import style from "./style.module.scss";
import Font from "Shared/Font";
import Card from "Shared/Card";
import Table from "Shared/Table";
import { Columns, WideColumn, SmallColumn } from "Shared/Grid";
import Modal from "Shared/Modal";
import Stake from "./stake";
import { connect } from "react-redux";
import Button from "Shared/Button";
import contractsInit from "../config/contractsInit";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Snackbar, Grid } from "@material-ui/core";
import ContractInit from "../config/contractsInit";

let noDataFound = "No data found";

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="standard" {...props} />;
}

const moment = require("moment");
type Project = {
  title: string;
  date?: string;
};
const upcoming: Project[] = [
  {
    title: "Amazon dApp build",
  },
  {
    title: "Uber replacement dApp",
    date: "08/01/2020",
  },
  {
    title: "Facebook dApp build",
    date: "08/01/2020",
  },
  {
    title: "Youtube dApp build",
    date: "09/01/2020",
  },
  {
    title: "Whatsapp dApp build",
    date: "09/01/2020",
  },
  {
    title: "DEX aggregator build",
    date: "09/01/2020",
  },
  {
    title: "Gamer Marketplace build",
    date: "09/01/2020",
  },
  {
    title: "Tokenization dApp build",
    date: "10/01/2020",
  },
];
const past = [
  ["DEX dApp build", "07/01/2020", <Font color="success">Pass</Font>],
  ["Other dApp build", "07/01/2020", <Font color="success">Pass</Font>],
  ["Other dApp build", "07/01/2020", "Fail"],
  ["Other dApp build", "07/01/2020", "Fail"],
  ["Other dApp build", "07/01/2020", <Font color="success">Pass</Font>],
  ["Other dApp build", "07/01/2020", "Fail"],
  ["Other dApp build", "07/01/2020", <Font color="success">Pass</Font>],
  ["Other dApp build", "07/01/2020", <Font color="success">Pass</Font>],
];
const Votes = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState({});
  const [proposals, setProposals] = useState([]);
  const [ethereumNetworkError, setEthereumNetworkError] = useState(false);
  const [stakedSnackBar, setStakedSnackBar] = useState(false);
  const [allowModalOpen, setAllowModalOpen]: any = useState({});
  const [transactionRejected, setTransactionRejected] = useState(false);
  const [loading1,setLoading1]=useState(true);
  const [loading2,setLoading2]=useState(true)

  useEffect(() => {
    getData();
    getAllProposals();
  }, []);
  const renderAgain = async () => {
    await getData();
  };
  const getData = async () => {
    setLoading(true);
    const get = await axios
      .post(
        `${URL}${ProposalByStatus}`,
        {
          status: "Voting",
        },
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      )
      .then((value) => {
        setValue(value.data.result);
        setLoading(false);
        value.data.result.map((item: any, i: number) =>
          item.votingDate < date.toISOString()
            ? setAllowModalOpen((val: any) => ({ ...val, [`${i}`]: true }))
            : null
        );
        setLoading1(false)
      })
      .catch((err) => {
        setLoading(false);
        setLoading1(false)
      });
  };
  // Get All the Proposals Here and set it to the State
  const getAllProposals = async () => {
    const get = await axios
      .get(`${URL}${Proposal}`, {
        headers: {
          Authorization: `Bearer ${props.user.token}`,
        },
      })
      .then((value) => {
        console.log("value ss",value)
       let temp=value.data.result;
        for (let i = 0; i < temp.length; i++) {
          if (
           temp[i].status != "Accepted" &&
            temp[i].status != "Fail"
          ) {
            temp.splice(i, 1);
            i--;
          }
        }
        console.log(" setProposals ",temp)
        setProposals(temp);
        setLoading2(false);
      })
      .catch((err) => {
        setLoading2(false);
      });
  };
  const [modalItem, setModalItem] = React.useState<Project | undefined>(
    undefined
  );
  const closeModal = () => setModalItem(undefined);
  let date = new Date();
  const changeFormat = (date: any) => {
    date = new Date(date);
    return `${new Date(date.getTime()).getDate()}/${
      new Date(date.getTime()).getMonth() + 1
    }/${new Date(date.getTime()).getFullYear()} `;
  };
  const handleNetworkErrorSnackBar = () => {
    setEthereumNetworkError(false);
    setInterval(() => {
      setEthereumNetworkError(false);
    }, 3000);
  };
  const selectProposal = (item: any) => {
    setSelectedProposal(item);
    setModalItem(item);
  };
  const handleStakedSnackBar = (state: boolean = true) => {
    setStakedSnackBar(state);
  };
  
  const openModal = async (item: any) => {
    let temp: any = await ContractInit.init();
    console.log("123", temp.network);

  //  const networkResult: any = props.network;
    if (temp.network != "rinkeby") {
      setEthereumNetworkError(true);
      throw "Ethereum Network invalid !";
    } else {
      selectProposal(item);
    }
  };
  const handleTransactionRejectedError = (input: boolean) => {
    setTransactionRejected(input);
  };
  let styleFlagPassVotes = "passVotes";
  let styleFlagUpcomingVotes = "upcomingVotes";
  return (
    <>
      {!loading && modalItem && (
        <Modal
          close={closeModal}
          title={modalItem.title}
          styleFlag={"stakeModal"}
          //showSnackBar={true}
          // actions={
          // <>
          // <Button primary onClick={closeModal}>
          // Yes
          // </Button>
          // <Button primary outline onClick={closeModal}>
          // No
          // </Button>
          // </>
          // }
        >
          <div className={style.modalContent}>
            <div className={style.modalInfo}>
              <Stake
                proposal={selectedProposal}
                close={closeModal}
                renderAgain={renderAgain}
                handleStakedSnackBar={handleStakedSnackBar}
                handleTransactionRejectedError={handleTransactionRejectedError}
              />
            </div>
          </div>
        </Modal>
      )}
      <Columns>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          md={6}
          alignItems="center"
          justify="center"
          spacing={2}
        >
          <Card styleFlag={styleFlagUpcomingVotes} title="Upcoming Votes"  tooltipMessage="All proposals passing the upvote stage and ready for voting">
            <Table
              styleFlag={styleFlagUpcomingVotes}
              columns={["Proposal", "Voting Day (dd/mm/yyyy)"]}
            >
              {value.length === 0 ? (
                <>
                {" "}
                <tr>
                  <td>{loading1 ? "Loading..." : "No proposals found"}</td>
                </tr>{" "}
              </>
              ) : (
                value.map((item: any, i) => (
                  <tr
                    onClick={() => {
                      !allowModalOpen[`${i}`]
                        ? null
                        : !props.address
                        ? alert("please connect to metamask")
                        : !loading
                        ? openModal(item)
                        : null;
                    }}
                    key={i}
                  >
                    <td>{item.name}</td>

                    <td>
                      {item.votingDate < date.toISOString() ? (
                        <Font color="accent" pointer>
                          Vote Now
                        </Font>
                      ) : (
                        changeFormat(item.votingDate)
                      )}
                    </td>
                  </tr>
                ))
              )}
            </Table>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          md={6}
          alignItems="center"
          justify="center"
          spacing={2}
        >
          <div className={style.cardStyle}>
            <Card styleFlag={styleFlagPassVotes} title="Past Votes"  tooltipMessage="Recent voting results">
              <Table
                styleFlag={styleFlagPassVotes}
                columns={["Proposal", "Voting Day (dd/mm/yyyy)", "Pass/Fail"]}
              >
                {proposals.length === 0 ? (
                 <>
                 {" "}
                 <tr>
                   <td>{loading2 ? "Loading..." : "No results found"}</td>
                 </tr>{" "}
               </>
                ) : (
                  proposals.map((proposal: any, i: any) => (
                    <>
                      {proposal.status == "Accepted" ||
                      proposal.status == "Fail" ? (
                        <tr key={i}>
                          <td key={i + 1}> {proposal.name} </td>
                          <td key={i + 2}>
                            {changeFormat(proposal.votingDate)}
                          </td>
                          {proposal.status == "Accepted" ? (
                            <td key={i + 3} style={{ color: "#29B700" }}>
                              Pass
                            </td>
                          ) : (
                            <td key={i + 3}>Fail</td>
                          )}
                        </tr>
                      ) : null}
                    </>
                  ))
                )}
                <Snackbar
                  open={ethereumNetworkError}
                  autoHideDuration={2000}
                  message={props.toastMessage}
                  onClose={() => handleNetworkErrorSnackBar()}
                >
                  <Alert style={{ fontSize: "12px" }} severity="error">
                    Ethereum network must be Rinkeby !
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={stakedSnackBar}
                  autoHideDuration={2000}
                  message={props.toastMessage}
                  onClose={() => handleStakedSnackBar(false)}
                >
                  <Alert style={{ fontSize: "12px" }} severity="success">
                    Stake Successfull
                  </Alert>
                </Snackbar>

                <Snackbar
                  open={transactionRejected}
                  autoHideDuration={2000}
                  message={props.toastMessage}
                  onClose={() => handleTransactionRejectedError(false)}
                >
                  <Alert style={{ fontSize: "12px" }} severity="error">
                    Transaction Rejected
                  </Alert>
                </Snackbar>
              </Table>
            </Card>
          </div>
        </Grid>
      </Columns>
    </>
  );
};
const mapStateToProps = (state: any) => ({
  user: state.userDetails.user,
  address: state.layoutReducer.address,
  network: state.layoutReducer.network,
});
export default connect(mapStateToProps)(Votes);
