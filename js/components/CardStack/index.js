import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder } from 'react-native';

import Card from '../Card';
import styles from './styles';

const SWIPE_THRESHOLD = 50;

class CardStack extends PureComponent {
    constructor(props) {
        super(props);

        const { cardsCount } = this.props;

        this.state = {
            currentCard: cardsCount - 1,
        };
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (() => true),
            onPanResponderRelease: this.handleTouchRelease,
        });
    }

    handleSwipe = (dx) => {
        const { cardsCount } = this.props;

        if (dx > 0) {
            this.setState((prevState) => {
                if (prevState.currentCard !== 0) {
                    return { currentCard: prevState.currentCard - 1 };
                }
                return null;
            });
        } else {
            this.setState((prevState) => {
                if (prevState.currentCard !== cardsCount - 1) {
                    return { currentCard: prevState.currentCard + 1 };
                }
                return null;
            });
        }
    };

    handleTouchRelease = (evt, gestureState) => {
        const { dx } = gestureState;
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
            this.handleSwipe(dx);
        }
    };

    render() {
        const { cardsCount } = this.props;
        const { currentCard } = this.state;

        return (
            <View
                {...this._panResponder.panHandlers}
                style={styles.cardStack}
            >
                {
                    Array(cardsCount).fill(undefined).map((item, index) => (
                        <Card
                            key={`card-${index}`}
                            totalCards={cardsCount}
                            topCardIndex={currentCard}
                            index={index}
                        />
                    ))
                }
            </View>
        );
    }
}

CardStack.propTypes = {
    cardsCount: PropTypes.number.isRequired,
};

export default CardStack;
