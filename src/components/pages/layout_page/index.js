import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import BoardAnimation from '../../board_animation'
import Header from '../../header'
import Leaderboard from '../../leaderboard'
import ControlPanel from '../../control_panel'
// import Footer from '../../footer'
import { withStyles } from '@material-ui/core/styles';
import styles from './styles'

class LayoutPage extends Component {

  render() {
    const { classes, isFetching } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <BoardAnimation n={16} width={window.innerWidth / 2} height={window.innerHeight} />
          </Grid>
          <Grid item xs={6} className={classes.rightContent}>
            <Header />
            <Container>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <Leaderboard />
                </Grid>
                <Grid item xs={6}>
                  <ControlPanel name="inclusion" />
                </Grid>
              </Grid>              
            </Container>
            {/* <Footer /> */}
          </Grid>
        </Grid>
      </div>
    )
  }
}

LayoutPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    isFetching: !!state.fetchers.async,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(LayoutPage));
