import { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

import { FormField } from '@/components/ui/form-field';
import { PrimaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SliderFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (nextValue: number) => void;
  valueLabel: string;
  error?: string;
  helper?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  valueLabel,
  error,
  helper,
}: SliderFieldProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackX, setTrackX] = useState(0);
  const trackRef = useRef<View>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const trackColor = isDark ? '#1f2937' : '#e5e7eb';
  const fillColor = isDark ? '#e5e7eb' : '#111827';
  const thumbColor = isDark ? '#f9fafb' : '#111827';

  const safeValue = clamp(value, min, max);
  const percent = (safeValue - min) / (max - min || 1);
  const thumbSize = 18;
  const thumbOffset = trackWidth * clamp(percent, 0, 1);
  const maxThumbLeft = Math.max(0, trackWidth - thumbSize);
  const thumbLeft = clamp(thumbOffset - thumbSize / 2, 0, maxThumbLeft);

  const handleChange = useCallback(
    (positionX: number) => {
      if (trackWidth <= 0) {
        return;
      }
      const ratio = clamp(positionX / trackWidth, 0, 1);
      const rawValue = min + ratio * (max - min);
      const steppedValue = clamp(
        min + Math.round((rawValue - min) / step) * step,
        min,
        max
      );
      if (steppedValue === value) {
        return;
      }
      onChange(steppedValue);
    },
    [trackWidth, min, max, step, onChange, value]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          handleChange(event.nativeEvent.pageX - trackX);
        },
        onPanResponderMove: (_event, gestureState) => {
          handleChange(gestureState.moveX - trackX);
        },
      }),
    [handleChange, trackX]
  );

  return (
    <FormField label={label} error={error} helper={helper}>
      <View style={styles.sliderRow}>
        <View
          ref={trackRef}
          style={[styles.track, { backgroundColor: trackColor }]}
          onLayout={(event) => {
            setTrackWidth(event.nativeEvent.layout.width);
            trackRef.current?.measure((_x, _y, _w, _h, pageX) => {
              setTrackX(pageX);
            });
          }}
          {...panResponder.panHandlers}>
          <View
            style={[
              styles.fill,
              { backgroundColor: fillColor, width: trackWidth * clamp(percent, 0, 1) },
            ]}
          />
          <View
            style={[
              styles.thumb,
              {
                backgroundColor: thumbColor,
                borderColor: fillColor,
                left: thumbLeft,
              },
            ]}
          />
        </View>
        <PrimaryText style={styles.valueLabel}>{valueLabel}</PrimaryText>
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    justifyContent: 'center',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  valueLabel: {
    minWidth: 64,
    textAlign: 'right',
  },
});
