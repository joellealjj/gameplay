import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, FlatList } from 'react-native';

import { styles } from './styles';
import { Profile } from '../../components/Profile';
import { ButtonAdd } from '../../components/ButtonAdd';
import { CategorySelect } from '../../components/CategorySelect';
import { ListHeader } from '../../components/ListHeader';
import { Appointment, AppointmentProps } from '../../components/Appointment';
import { ListDivider } from '../../components/ListDivider';
import { Background } from '../../components/Background';
import { COLLECTION_APPOINTMENTS } from '../../configs/database';
import { Load } from '../../components/Load';

export function Home() {
	const [category, setCategory] = useState('');
	const [loading, setLoading] = useState(true);
	const [appointments, setAppointments] = useState<AppointmentProps[]>([]);

	const navigation = useNavigation();


	// funcao para marcar e desmarcar
	function handleCategorySelect(categoryId: string) {
		categoryId === category ? setCategory('') : setCategory(categoryId);
	}

	function handleAppointmentDetails(guildSelected: AppointmentProps) {
		navigation.navigate('AppointmentDetails', { guildSelected: guildSelected });
	}

	function handleAppointmentCreate() {
		navigation.navigate('AppointmentCreate');
	}

	async function loadAppointments() {
		const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
		const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

		if (category) {
			setAppointments(storage.filter(item => item.category === category));
		} else {
			setAppointments(storage);
		}

		setLoading(false);
	}

	// useEffect memoriza o estado e evita renderizacao
	// se quiser que recarregue a tela novamente utiliza o useFocusEffect do navigation
	// useFocusEffect funciona tbm com o hook useCallback que memoriza funcao
	useFocusEffect(useCallback(() => {
		loadAppointments();
	},[category]));

	return (
		<Background>
			<View style={styles.header}>
				<Profile />
				<ButtonAdd onPress={handleAppointmentCreate} />
			</View>

			<CategorySelect
				categorySelected={category}
				setCategory={handleCategorySelect}
			/>

			{
				loading ? <Load /> :
				<>
					<ListHeader
						title="Partidas agendadas"
						subTitle={`Total ${appointments.length}`}
					/>

					<FlatList
						data={appointments}
						keyExtractor={item => item.id}
						renderItem={({ item }) => (
							<Appointment
								data={item}
								onPress={() => handleAppointmentDetails(item)}	
							/>
						)}
						style={styles.matches}
						showsVerticalScrollIndicator={false}
						ItemSeparatorComponent={() => <ListDivider />}
						contentContainerStyle={{ paddingBottom: 69 }}
					/>
				</>
			}
		</Background>
	);
};