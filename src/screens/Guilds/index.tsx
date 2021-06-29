import React from 'react';
import { View, FlatList } from 'react-native';

import { styles } from './styles';

import { Guild, GuildProps } from '../../components/Guild';
import { ListDivider } from '../../components/ListDivider';

type Props = {
    // retorno de void
    handleGuildSelect: (guild: GuildProps) => void;
}

export function Guilds({ handleGuildSelect } : Props){
    const guilds = [
        {
            id: '1',
            name: 'Lendários',
            icon: 'image.png',
            owner: true
        },
        {
            id: '2',
            name: 'Um',
            icon: 'image.png',
            owner: true
        },
        {
            id: '3',
            name: 'Dois',
            icon: 'image.png',
            owner: true
        },
        {
            id: '4',
            name: 'Tres',
            icon: 'image.png',
            owner: true
        },
        {
            id: '5',
            name: 'Quatro',
            icon: 'image.png',
            owner: true
        },
        {
            id: '6',
            name: 'Cinco',
            icon: 'image.png',
            owner: true
        }
    ]
    
    return (
        <View style={styles.container}>
            <FlatList
                data={guilds}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Guild 
                        data={item} 
                        onPress={() => handleGuildSelect(item)}
                    />
                )}
                ItemSeparatorComponent={() => <ListDivider isCentered />}
                showsVerticalScrollIndicator={false}
                style={styles.guilds}
                contentContainerStyle={{ paddingBottom: 68, paddingTop: 103 }}
                ListHeaderComponent={() => <ListDivider isCentered />}
            />
        </View>
    );
};