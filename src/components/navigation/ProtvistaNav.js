import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    background: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});
function getItems() {
  var json = {
    list: [
      {
        id: 1,
        title: "",
        items: [
          {
            id: 3,
            name: "Navigation"
          },
          {
            id: 2,
            name: "Seqeunce"
          },

          {
            id: 1,
            name: "glycoslyation",
            subitems: [
              {
                id: 1,
                name: "Nougat"
              },
              {
                id: 2,
                name: "Lollipop"
              }
            ]
          },
          {
            id: 3,
            name: "Chrome"
          }
        ]
      }
    ]
  };
  return json;
}
class ProtvistaNav extends React.Component {
  state = {};
  handleClick = e => {
    this.setState({ [e]: !this.state[e] });
  };
  render() {
    const items = getItems();
    const { classes } = this.props;
    return (
      <div>
        {items.list.map(list => {
          return (
            <List className={classes.root} key={list.id} subheader={list.title}>
              {list.items.map(item => {
                return (
                  <div key={item.id}>
                    {item.subitems != null ? (
                      <div key={item.id}>
                        <ListItem
                          button
                          key={item.id}
                          onClick={this.handleClick.bind(this, item.name)}
                        >
                          <ListItemText primary={item.name} />
                          {this.state[item.name] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </ListItem>
                        <Collapse
                          key={list.items.id}
                          component="li"
                          in={this.state[item.name]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List disablePadding>
                            {item.subitems.map(sitem => {
                              return (
                                <ListItem
                                  button
                                  key={sitem.id}
                                  className={classes.nested}
                                >
                                  <ListItemText
                                    key={sitem.id}
                                    primary={sitem.name}
                                  />
                                </ListItem>
                              );
                            })}
                          </List>
                        </Collapse>{" "}
                      </div>
                    ) : (
                      <ListItem
                        button
                        onClick={this.handleClick.bind(this, item.name)}
                        key={item.id}
                      >
                        <ListItemText primary={item.name} />
                      </ListItem>
                    )}
                  </div>
                );
              })}
            </List>
          );
        })}
      </div>
    );
  }
}
ProtvistaNav.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ProtvistaNav);
