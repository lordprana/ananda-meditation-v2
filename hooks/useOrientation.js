import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useOrientation() {
  const getOrientation = () => {
    const { width, height } = Dimensions.get('window');
    return height >= width ? 'PORTRAIT' : 'LANDSCAPE';
  };

  const [orientation, setOrientation] = useState(getOrientation());

  useEffect(() => {
    const onChange = ({ window }) => {
      const newOrientation = window.height >= window.width ? 'PORTRAIT' : 'LANDSCAPE';
      setOrientation(newOrientation);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  return orientation;
}
