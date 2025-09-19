// src/components/NetworkStatus.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from 'react-native';

export default function NetworkStatus() {
  const isConnected = useSelector((state) => state.network.isConnected);

  return (
    <View style={{ padding: 8 }}>
      {isConnected ? (
        <Text style={{ color: 'green' }}>Online</Text>
      ) : (
        <Text style={{ color: 'red' }}>Offline</Text>
      )}
    </View>
  );
}
