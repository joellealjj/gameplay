import React from 'react';
import { View, Text, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';

import { useAuth } from '../../hooks/auth';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';
import IllustrationImg from '../../assets/illustration.png';

import { ButtonIcon } from '../../components/ButtonIcon';
import { Background } from '../../components/Background';

export function SignIn() {
    // consigo recuperar o user
    const { loading, signIn } = useAuth();

    async function handleSignIn() {
        try {
            await signIn();
        } catch (error) {
            Alert.alert(error);
        }
    }

    return (
        <ScrollView>
            <Background>
                <View style={styles.container}>
                    <Image
                    source={IllustrationImg}
                    style={styles.image}
                    resizeMode="stretch"
                    />

                    <View style={styles.content}>
                    <Text style={styles.title}>
                        Conecte-se {'\n'}
                        e organize suas {'\n'}
                        jogatinas
                    </Text>
                    
                    <Text style={styles.subTitle}>
                        Crie grupos para jogar seus games {'\n'}
                        favoritos com seus amigos 
                    </Text>

                    {
                        loading ? <ActivityIndicator color={theme.colors.primary} /> : 
                        <ButtonIcon
                            title="Entrar com Discord"
                            onPress={handleSignIn}
                        />
                    }
                    </View>
                </View>
            </Background>
        </ScrollView>
    )
};