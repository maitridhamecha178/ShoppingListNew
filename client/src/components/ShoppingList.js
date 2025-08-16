import React, { Component, createRef } from 'react';
import { Container, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import {connect } from 'react-redux';
import { getItems, deleteItem } from '../actions/itemActions';
import PropTypes from 'prop-types';

class ShoppingList extends Component {

    componentDidMount(){
        this.props.getItems();
    };

    onDeleteClick = (id) => {
        this.props.deleteItem(id);
    };

        

    constructor(props) {
        super(props);
        // Create a ref map for each item
        this.nodeRefs = {};
    }

    removeItem = id => {
        this.setState(state => ({
            items: state.items.filter(item => item.id !== id)
        }));
    };

    render() {
        const { items } = this.props.item;

        return (
            <Container>
                <ul className="list-group">
                    <TransitionGroup className="shopping-list">
                        {items.map(({ _id, name }) => {
                            // Create a ref if it doesn't exist
                            if (!this.nodeRefs[_id]) {
                                this.nodeRefs[_id] = createRef();
                            }
                            return (
                                <CSSTransition
                                    key={_id}
                                    timeout={500}
                                    classNames="fade"
                                    nodeRef={this.nodeRefs[_id]}
                                >
                                    <li
                                        ref={this.nodeRefs[_id]}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {name}
                                        <Button
                                            className="remove-btn"
                                            color="danger"
                                            size="sm"
                                            onClick={this.onDeleteClick.bind(this, _id)}
                                        >
                                            &times;
                                        </Button>
                                    </li>
                                </CSSTransition>
                            );
                        })}
                    </TransitionGroup>
                </ul>
            </Container>
        );
    }
}


ShoppingList.propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired  
}

const mapStateToProps = (state) => ({
    item: state.item
});

export default connect(mapStateToProps, {getItems, deleteItem })(ShoppingList);