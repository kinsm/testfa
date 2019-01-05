import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Animated, Dimensions } from 'react-native';

import styles from './styles';

const colors = [ 'red', 'green', 'blue', 'yellow', 'green' ];

const { width } = Dimensions.get('screen');
const CARD_PADDING = 10;
const MAX_VISIBLE_CARDS = 3;

function getCardAnimationProps({ topCardIndex, index }) {
    const scaleX = Math.max(1 + index / 10 - topCardIndex / 10, 0);
    const maxTranslateY = (MAX_VISIBLE_CARDS - 1) * CARD_PADDING;
    const translateY = Math.max(maxTranslateY - (topCardIndex - index) * 10, 0);

    return {
        scaleX,
        translateY,
    };
}

class Card extends PureComponent {
    constructor(props) {
        super(props);

        const { index, topCardIndex } = props;
        const animationProps = getCardAnimationProps({ index, topCardIndex });

        this.translateX = new Animated.Value(0);
        this.translateY = new Animated.Value(animationProps.translateY);
        this.scaleX = new Animated.Value(animationProps.scaleX);
    }

    componentDidUpdate() {
        const { index, topCardIndex } = this.props;
        const { translateY, scaleX } = getCardAnimationProps({ index, topCardIndex });

        const animationStack = [
            Animated.spring(
                this.translateY,
                {
                    toValue: translateY,
                    useNativeDriver: true,
                },
            ),
            Animated.spring(
                this.scaleX,
                {
                    toValue: scaleX,
                    useNativeDriver: true,
                },
            ),
        ];

        let translateX;
        if (index - 1 === topCardIndex) {
            translateX = width;
        } else if (index === topCardIndex) {
            translateX = 0;
        }

        if (translateX !== undefined) {
            animationStack.push(
                Animated.spring(
                    this.translateX,
                    {
                        toValue: translateX,
                        useNativeDriver: true,
                    },
                ),
            );
        }

        Animated.parallel(
            animationStack,
            { stopTogether: false },
        ).start();
    }

    render() {
        const { index } = this.props;

        return (
            <Animated.View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors[index % colors.length],
                        zIndex: index,
                        transform: [
                            { scaleX: this.scaleX },
                            { translateY: this.translateY },
                            { translateX: this.translateX },
                        ],
                    },
                ]}
            >
                <Text>{index + 1}</Text>
            </Animated.View>
        );
    }
}

Card.propTypes = {
    index: PropTypes.number.isRequired,
    topCardIndex: PropTypes.number.isRequired,
};

export default Card;
