import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { clearAddress } from '../../actions/leaderboard'
import { networkDisplay, stashDisplay, nameDisplay, stakeDisplay, commissionDisplay, rateDisplay } from '../../utils/display'
import { NETWORK, networkWSS } from '../../constants'
import { selectors } from '../../selectors'
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import LaunchIcon from '@material-ui/icons/Launch';
import Typography from '@material-ui/core/Typography';
import Identicon from '@polkadot/react-identicon';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles'

class AccountInfo extends Component {
	
	handleClear = () => {
    this.props.clearAddress()
  }

  handleClickExternalGraph = (stash) => {
    const uri = encodeURI(`https://polkadot.js.org/apps/?rpc=${networkWSS[NETWORK]}#/staking/query/${stash}`)
    window.open(uri, '_blank')
  }

 	render() {
		const { classes, account } = this.props;

    const stash = networkDisplay(account.id)
		
		return (
      <div className={classes.root}>
        <Box className={classes.header}>
          <IconButton aria-label="back" className={classes.backIcon} onClick={this.handleClear}>
            <ClearIcon />
          </IconButton>
          <Identicon
            value={stash}
            size={64}
            theme={'polkadot'} />
          <Typography variant="h4" color="textPrimary" >
					  {stashDisplay(stash)}
					</Typography>
          <Typography variant="subtitle1" color="textPrimary" >
            {!!account.name ? nameDisplay(account.name) : '-'}
          </Typography>
        </Box>
        <List dense>
          <ListItem>
            <ListItemText primary="Rank" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={account.rank} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Controller" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText
              primary={stashDisplay(networkDisplay(account.controller))}
              classes={{
                secondary: classes.secondaryItemText
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Inclusion Rate" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={rateDisplay(account.inclusion_rate)} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Commission" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={commissionDisplay(account.commission)} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Own Stake" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={stakeDisplay(account.own_stake)} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Others Stake" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={stakeDisplay(account.nominators_stake)} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Nominators" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={account.nominators} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Average Reward Points" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={account.avg_reward_points} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Reward Staked" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={!!account.reward_staked ? 'true' : 'false'} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Judgements" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={account.judgements} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Sub or Sibling Accounts" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={account.sub_accounts} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Active" 
              classes={{ root: classes.rootItemText, primary: classes.primaryItemText }} />
            <ListItemText primary={!!account.active ? 'true' : 'false'} classes={{ secondary: classes.secondaryItemText }} />
          </ListItem>
        </List>
        <Box className={classes.footer}>
          <IconButton aria-label="back" className={classes.graphIcon} onClick={() => this.handleClickExternalGraph(stash)}>
            <LaunchIcon />
          </IconButton>
        </Box>
      </div>
    )
	}
}

AccountInfo.propTypes = {
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const account = selectors.getObjectByEntityAndId(state, 'validator', state.leaderboard.selected)
  return {
		account,
    isFetching: !!state.fetchers.async,
  }
}

export default connect(mapStateToProps, { clearAddress })(withStyles(styles)(AccountInfo));
  