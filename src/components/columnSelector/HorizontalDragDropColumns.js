import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

const style = {
  border: '1px',
  backgroundColor: '#2f78b7',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  marginTop: '.5rem',
  color: 'white',
  cursor: 'move',
}

const reorder = (list, startIndex, endIndex) => {
  let result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result = result.map((obj, index) => { obj.order = index + 1; return obj; })
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,
  cursor: 'move',
  color: 'white',

  // change bg colour if dragging
  background: isDragging ? "#afd9fd" : '#2f78b7',

  // styles for draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver, itemsLength) => ({
  display: "flex",
  paddingBottom: '5px',
  paddingTop: '5px'
});

class HorizontalDragDropColumns extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.props.items,
      result.source.index,
      result.destination.index
    );

    this.props.setItems(items);
  }

  render() {
    return (
      <>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                id="drag-drop-list"
                sx={{
                  justifyContent: 'center',
                  listStyle: 'none',
                  overflow: "scroll",
                  borderRadius: 2,
                  p: 1,
                }}
                component="ul"
                variant="outlined"
              >
                <div style={getListStyle(snapshot.isDraggingOver, this.props.items.length)}>
                  {this.props.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <Chip className="chiphover" ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          label={item.label} variant="outlined"
                          onDelete={item.immutable ? undefined : () => this.props.deleteItem(item.id)}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          classes={{
                            deleteIcon: 'delete-icon-chip'
                          }}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </Paper>
            )}
          </Droppable>
        </DragDropContext>
      </>
    );
  }
}

export default HorizontalDragDropColumns;
