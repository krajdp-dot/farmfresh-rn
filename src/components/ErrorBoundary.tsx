import React from 'react';
import { View, Text } from 'react-native';

interface State { hasError: boolean; error: string }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state = { hasError: false, error: '' };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: error?.message || String(error) };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex:1, backgroundColor:'red', alignItems:'center', justifyContent:'center', padding:20 }}>
          <Text style={{ color:'white', fontSize:18, fontWeight:'bold', marginBottom:10 }}>CRASH</Text>
          <Text style={{ color:'white', fontSize:13 }}>{this.state.error}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
