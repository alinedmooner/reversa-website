import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import usePrefersReducedMotion from '../usePrefersReducedMotion';

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0
};

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness
  });

  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView) setStarted(true);
  }, [isInView]);

  // With lazy hydration (client:visible) a fast scroll can move the element
  // past the viewport before the observer attaches — isInView would then
  // never fire and the number would sit at `from`. If the element is already
  // at or above the viewport when we mount, start immediately.
  useEffect(() => {
    if (!started && ref.current && ref.current.getBoundingClientRect().top < window.innerHeight) {
      setStarted(true);
    }
  }, [started]);

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0
      };

      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);

      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (!ref.current) return;
    // Reduced motion: pin the final value (it is also the SSR output).
    // Otherwise reset to the start value, ready to animate.
    ref.current.textContent = formatValue(
      reducedMotion ? (direction === 'down' ? from : to) : direction === 'down' ? to : from
    );
  }, [from, to, direction, formatValue, reducedMotion]);

  useEffect(() => {
    if (started && startWhen && !reducedMotion) {
      if (typeof onStart === 'function') {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [started, startWhen, reducedMotion, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  // Server-render the final value so the number is visible without JS; the
  // spring resets it to `from` and animates only once hydrated and in view.
  // Screen readers always get the stable final value — the animating span is
  // out of the accessibility tree so nobody hears "0" mid-count.
  const finalValue = formatValue(direction === 'down' ? from : to);
  return (
    <>
      <span style={srOnly}>{finalValue}</span>
      <span className={className} ref={ref} aria-hidden="true">
        {finalValue}
      </span>
    </>
  );
}
