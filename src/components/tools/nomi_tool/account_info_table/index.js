import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { get, getValidatorRank } from '../../../../actions/validator'
import { addAddress, removeAddress, clearAddress } from '../../../../actions/leaderboard'
import { stashDisplay, nameDisplay, stakeDisplayNoSymbol, commissionDisplay, rateDisplay } from '../../../../utils/display'
import {getNetworkWSS } from '../../../../constants'
import { selectors } from '../../../../selectors'
import { encodeAddress } from '@polkadot/util-crypto'
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { ReactComponent as PolkadotJsSVG } from '../../../../assets/polkadot_js_logo.svg';
import { ReactComponent as SubscanSVG } from '../../../../assets/subscan_logo.svg';
import Identicon from '@polkadot/react-identicon';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles'

const displayScore = scores => {
  if (!!scores) {
    let score = scores.reduce((acc, x) => acc + x, 0)
    return Math.round(score * 100) / 100
  }
  return '-'
}

const displayMaxScore = weights => {
  if (!!weights) {
    return weights.split(",").map(x => parseInt(x, 10)).reduce((acc, x) => acc + x, 0)
  }
  return '-'
}

const round2 = (value) => {
  return Math.round(value * 100) / 100
}

const addRow = (name, value, interval, score) => {
  return { name, value, interval, score };
}

class AccountInfoTable extends Component {

  componentDidMount() {
    const {address, weights} = this.props
    if (!!address) {
      this.props.get(address)
      if (!!weights) {
        this.props.getValidatorRank(address, {q: "Board", w: weights}, {expire: 0})
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {address, weights, isFetching, account} = this.props
    if (!isFetching && !!address && prevProps.address !== address && !account.id) {
      this.props.get(address)
    }
    if (!isFetching && (prevProps.weights !== weights || (!!address && prevProps.address !== address))) {
      this.props.getValidatorRank(address, {q: "Board", w: weights}, {expire: 0})
    }
  }
	
	handleClose = () => {
    this.props.clearAddress()
  }

  handleClickPolkadotJsExternal = (stash) => {
    const {network} = this.props
    const uri = encodeURI(`https://polkadot.js.org/apps/?rpc=${getNetworkWSS(network)}#/staking/query/${stash}`)
    window.open(uri, '_blank')
  }

  handleClickSubscanExternal = (stash) => {
    const {network} = this.props
    const uri = encodeURI(`https://${network}.subscan.io/validator/${stash}`)
    window.open(uri, '_blank')
  }

  handleCandidate = () => {
    const {address, isCandidate} = this.props
    if (isCandidate) {
      return this.props.removeAddress(address)
    }
    this.props.addAddress(address)
  }

 	render() {
		const { classes, width, rows, account, weights, networkDetails, isFetching, isCandidate, canBeAdded } = this.props;
    console.log("__", isCandidate, canBeAdded);
    
    if (isFetching) {
      return (
        <div className={classes.root}>
          <Fade in={isFetching} 
            style={{
                transitionDelay: !isFetching ? '10ms' : '0ms',
              }}
              unmountOnExit
            >
            <CircularProgress size={24} />
          </Fade>
        </div>
    )}

    if (!account.id || !account.scores || !account.rank || !account.limits) {
      return null
    }

    const stash = encodeAddress(account.id, networkDetails.ss58_format)

    return (
      <div className={classes.root}>
        <Box className={classes.headerBox}>
          <Typography
              variant={isWidthUp('xl', width) ? "h1": "h2"}
              className={classes.rank}
              color="textPrimary"
            >
              {` ${account.rank}`}
            </Typography>
          <Identicon
            value={stash}
            size={isWidthUp('xl', width) ? 64 : 48}
            theme={'polkadot'} />
          <Typography variant={"h6"} >
            {stashDisplay(stash)}
          </Typography>
          <Typography variant="subtitle2">
            {!!account.name ? nameDisplay(account.name, 30) : "-"}
          </Typography>
        </Box>

        <Box className={classes.tableBox}>
          <IconButton aria-label="Close" color="default"
            className={classes.closeButton}
            onClick={this.handleClose}>
            <ClearIcon />
          </IconButton>
          <Button variant="contained" color={isCandidate ? "secondary" : "primary" }
            disabled={!isCandidate && !canBeAdded}
            onClick={this.handleCandidate} className={classes.selectButton}>
            {isCandidate ? `Remove candidate` : `Add candidate`}
          </Button>
          <TableContainer component={Paper} elevation={0} 
            classes={{root: classes.tableContainerRoot}}>
            <Table size="small" className={classes.table} >
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="right">Interval</TableCell>
                  <TableCell align="right">Score / Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    className={classes.tableRow}
                  >
                    <TableCell component="th" scope="row" style={{whiteSpace: "nowrap"}}>
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">{row.interval}</TableCell>
                    <TableCell align="right">{row.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className={classes.tableRow}>
                  <TableCell classes={{footer: classes.cellFooter}}>Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right" classes={{footer: classes.cellFooter}}>{`${displayScore(account.scores)} / ${displayMaxScore(weights)}`}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
        <Box className={classes.footerBox}>
          <IconButton aria-label="Polkadot{.js}" className={classes.iconBtn} 
            onClick={() => this.handleClickPolkadotJsExternal(stash)}>
            <PolkadotJsSVG className={classes.iconLogo} />
          </IconButton>
          <IconButton aria-label="Subscan" className={classes.iconBtn} 
            onClick={() => this.handleClickSubscanExternal(stash)}>
            <SubscanSVG className={classes.iconLogo} />
          </IconButton>
        </Box>
      </div>
    )
	}
}

AccountInfoTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const network = selectors.getApiNetwork(state)
  const networkDetails = selectors.getApiNetworkDetails(state)
  const address = state.leaderboard.selected
  const account = selectors.getObjectByEntityAndId(state, 'validator', address)
  const weights = state.leaderboard.weights

  const weightsFn = (i) => weights.split(",").map(x => parseInt(x, 10))[i]

  const scoreFn = (i) => round2(account.scores[i])

  const createTableData = () => {
    if (!network || !account.id || !account.scores || !account.rank || !account.limits) {
      return []
    }
    return [
      addRow('Inclusion rate', rateDisplay(account.inclusion_rate), `[0, 100]`, `${scoreFn(0)} / ${weightsFn(0)}`),
      addRow('Commission', commissionDisplay(account.commission), `[0, 100]`, `${scoreFn(1)} / ${weightsFn(1)}`),
      addRow('Nominators', account.nominators, `[0, 256]`, `${scoreFn(2)} / ${weightsFn(2)}`),
      addRow('Average points', Math.round(account.avg_reward_points), `[${Math.round(account.limits.min_avg_points_limit)}, ${Math.round(account.limits.max_avg_points_limit)}]`, `${scoreFn(3)} / ${weightsFn(3)}`),
      addRow('Stake rewards', !!account.reward_staked ? 'yes' : 'no', `[0, 1]`, `${scoreFn(4)} / ${weightsFn(4)}`),
      addRow("Active", !!account.active ? 'yes' : 'no', `[0, 1]`, `${scoreFn(5)} / ${weightsFn(5)}`),
      addRow(`Own self-stake (${networkDetails.token_symbol})`, stakeDisplayNoSymbol(account.own_stake, networkDetails), `[${stakeDisplayNoSymbol(account.limits.min_own_stake_limit, networkDetails)}, ${stakeDisplayNoSymbol(account.limits.max_own_stake_limit, networkDetails)}]`, `${scoreFn(6)} / ${weightsFn(6)}`),
      addRow(`Total stake (${networkDetails.token_symbol})`, stakeDisplayNoSymbol(account.own_stake + account.nominators_stake, networkDetails), `[${stakeDisplayNoSymbol(account.limits.min_total_stake_limit, networkDetails)}, ${stakeDisplayNoSymbol(account.limits.max_total_stake_limit, networkDetails)}]`, `${scoreFn(7)} / ${weightsFn(7)}`),
      addRow("Identity", account.judgements, `[${Math.abs(Math.round(account.limits.min_judgements_limit))}, ${Math.round(account.limits.max_judgements_limit)}]`, `${scoreFn(8)} / ${weightsFn(8)}`),
      addRow("Sub-accounts", account.sub_accounts, `[${Math.abs(Math.round(account.limits.min_sub_accounts_limit))}, ${Math.round(account.limits.max_sub_accounts_limit)}]`, `${scoreFn(9)} / ${weightsFn(9)}`),
      // addRow("Total", "", "", `${displayScore(account.scores)} / ${displayMaxScore(weights)}`),
    ];
  }
  
  const rows = createTableData()
  
  return {
    address,
    weights,
    account,
    rows,
    network,
    networkDetails,
    isCandidate: !!state.leaderboard.nominations.find(a => a === address),
    canBeAdded: state.web3.maxNominations > state.leaderboard.nominations.length,
    isFetching: !!state.fetchers.ids[`/validator/${address}`] || !!state.fetchers.ids[`/validator/${address}/rank`] || account.status === "NotReady",
  }
}

export default connect(mapStateToProps, { get, getValidatorRank, addAddress, removeAddress, clearAddress })(withWidth()(withStyles(styles)(AccountInfoTable)));
  