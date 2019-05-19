import React, { Component } from "react";
import DateRangePicker from "react-daterange-picker";
// import "react-daterange-picker/dist/css/react-calendar.css"; // For some basic styling. (OPTIONAL)
import "./calendar.css";
import Axios from "axios";
import moment from "moment";
import startCase from "lodash.startcase";
import Calendar from "@material-ui/icons/Today";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import {
  withStyles,
  Grid,
  Typography,
  Dialog,
  IconButton,
  Tooltip
} from "@material-ui/core";

const styles = {
  buttonsWrapper: {
    backgroundColor: "#9658001a",
    borderLeft: "1px solid #7a7a7a7a"
  },
  button: {
    boxSizing: "border-box",
    width: "100%",
    color: "black",
    textTransform: "capitalize",
    padding: "16.4px",
    cursor: "pointer",
    "&:hover": {
      color: "white",
      background: "linear-gradient(to left, #ecbb4c, #c3773b);"
    }
  },
  // dialog: {
  //   width: 930
  // },
  picker: {
    paddingTop: 10,
    width: 631
  },
  clear: {
    left: 24,
    position: "absolute",
    bottom: 14,
    cursor: "pointer"
  },
  apply: {
    color: "#ecbb4c",
    cursor: "pointer",
    position: "absolute",
    right: 144,
    bottom: 14
  }
};

class DP extends Component {
  state = {
    dates: null,
    startDate: null,
    singleDate: null,
    calendar: false
  };

  componentWillMount() {
    // API CORS
    Axios.get(
      "https://staging.sellermetrix.com/api/test/start_of_sales?marketplace=usa"
    )
      .then(res =>
        this.setState({
          startDate: new Date(moment(res.date)),
          dates: moment.range(
            moment()
              .clone()
              .startOf("month"),
            moment().clone()
          )
        })
      )
      .catch(err =>
        this.setState({
          startDate: new Date(moment("2018-09-17T00:00:00")),
          dates: moment.range(
            moment()
              .clone()
              .startOf("month"),
            moment().clone()
          )
        })
      );
  }

  onSelect = dates => {
    this.setState({ utilityDates: dates, utilitySingleDate: null });
  };

  openCalendar = () => {
    this.setState(state => ({ utilityDates: state.dates, calendar: true }));
  };

  closeCalendar = () => {
    this.setState({ calendar: false });
  };

  apply = () => {
    this.setState(state => ({
      calendar: false,
      dates: state.utilityDates,
      singleDate: state.utilitySingleDate
    }));
  };

  goBack = () => {
    this.setState(state => ({
      dates: moment.range(
        state.dates.start
          .clone()
          .subtract(2, "month")
          .isBefore(moment(state.startDate).startOf("month"))
          ? moment(state.startDate)
          : state.dates.start.subtract(1, "month").startOf("month"),
        state.dates.end.subtract(1, "month").endOf("month")
      )
    }));
  };

  goForward = () => {
    this.setState(state => ({
      dates: moment.range(
        state.dates.start.add(1, "month").startOf("month"),
        !state.dates.end
          .clone()
          .add(1, "month")
          .isBefore(moment().startOf("month"))
          ? moment().clone()
          : state.dates.end.add(1, "month").endOf("month")
      )
    }));
  };

  clearSelection = () => {
    this.setState({
      utilityDates: moment.range(
        moment()
          .clone()
          .subtract(1, "days"),
        moment().clone()
      ),
      utilitySingleDate: moment().clone()
    });
  };

  quickSelector = type => {
    let dates;
    this.setState({ utilitySingleDate: null });
    switch (type) {
      case "today":
        dates = moment.range(
          moment()
            .clone()
            .subtract(1, "days"),
          moment().clone()
        );
        this.setState({ utilitySingleDate: moment().clone() });
        break;
      case "yesterday":
        dates = moment.range(
          moment()
            .clone()
            .subtract(2, "days"),
          moment()
            .clone()
            .subtract(1, "days")
        );
        this.setState({
          utilitySingleDate: moment()
            .clone()
            .subtract(1, "days")
        });
        break;
      case "last7days":
        dates = moment.range(
          moment()
            .clone()
            .subtract(7, "days"),
          moment().clone()
        );
        break;
      case "last30days":
        dates = moment.range(
          moment()
            .clone()
            .subtract(30, "days"),
          moment().clone()
        );
        break;
      case "thisMonth":
        dates = moment.range(
          moment()
            .clone()
            .startOf("month"),
          moment().clone()
        );
        break;
      case "thisYear":
        dates = moment.range(
          moment()
            .clone()
            .startOf("year"),
          moment().clone()
        );
        break;
      case "lifetime":
        dates = moment.range(
          moment(this.state.startDate).clone(),
          moment().clone()
        );
        break;
      default:
        dates = null;
    }
    this.setState({ utilityDates: dates });
  };

  render() {
    const { startDate, dates, singleDate, calendar, utilityDates } = this.state;
    const { classes } = this.props;
    const quickSelectors = [
      "today",
      "yesterday",
      "last7days",
      "last30days",
      "thisMonth",
      "thisYear",
      "lifetime"
    ];
    let parsedSelectedDates = "Dates not selected";
    if (dates) {
      parsedSelectedDates = singleDate
        ? `${moment(singleDate).format("MMM DD, YYYY")}`
        : `${moment(dates.start.clone()).format("MMM DD, YYYY")} - ${moment(
            dates.end.clone()
          ).format("MMM DD, YYYY")}`;
    }

    const disableForward = dates
      ? !dates.end.isBefore(moment().startOf("month"))
      : false;
    console.log(startDate);
    const disableBack = dates
      ? dates.start
          .clone()
          .subtract(1, "month")
          .isBefore(moment(startDate).startOf("month"))
      : false;

    // const disableBackward = dates.start
    return (
      <>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Tooltip title="Open Calendar">
            <IconButton aria-label="Calendar" onClick={this.openCalendar}>
              <Calendar fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="30 days back">
            <IconButton
              aria-label="Back"
              onClick={this.goBack}
              disabled={disableBack}
            >
              <ChevronLeft fontSize="small" />
            </IconButton>
          </Tooltip>
          <p onClick={this.openCalendar}>{parsedSelectedDates}</p>
          <Tooltip title="30 days forward">
            <IconButton
              aria-label="Forward"
              onClick={this.goForward}
              disabled={disableForward}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
        <Dialog
          maxWidth={false}
          className={classes.dialog}
          open={calendar}
          onClose={this.closeCalendar}
        >
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item className={classes.picker}>
              <DateRangePicker
                onSelect={this.onSelect}
                numberOfCalendars={2}
                value={utilityDates}
                minimumDate={startDate}
                maximumDate={new Date()}
              />
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-start"
              >
                <Typography
                  variant="subtitle2"
                  className={classes.clear}
                  onClick={this.clearSelection}
                >
                  Clear selection
                </Typography>
                <Typography
                  variant="subtitle2"
                  onClick={this.apply}
                  className={classes.apply}
                >
                  Apply
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="flex-start"
                className={classes.buttonsWrapper}
              >
                {quickSelectors.map(selector => (
                  <div
                    className={classes.button}
                    color="primary"
                    key={selector}
                    onClick={() => this.quickSelector(selector)}
                  >
                    {startCase(selector)}
                  </div>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Dialog>
      </>
    );
  }
}

export const DatePicker = withStyles(styles)(DP);
