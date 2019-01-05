import React from 'react';
import { View } from 'react-native';
import CardStack from './js/components/CardStack';

export default function App() {
    return (
        <View style={{ flex: 1 }}>
            <CardStack cardsCount={12} />
        </View>
    );
}
