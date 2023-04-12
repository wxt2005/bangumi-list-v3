import React from 'react';
import classNames from 'classnames';
import { Weekday } from '../types';
import styles from './WeekdayTab.module.css';

const tabItems: [Weekday, string][] = [
  [Weekday.MONDAY, '周一'],
  [Weekday.TUESDAY, '周二'],
  [Weekday.WEDNESDAY, '周三'],
  [Weekday.THURSDAY, '周四'],
  [Weekday.FIRDAY, '周五'],
  [Weekday.SATURDAY, '周六'],
  [Weekday.SUNDAY, '周日'],
  [Weekday.ALL, '全部'],
];

interface Props {
  activated?: Weekday;
  onClick?: (tab: Weekday) => void;
  disabled?: boolean;
  className?: string;
}

export default function WeekdayTab(props: Props): JSX.Element {
  const { disabled = false } = props;
  const buttons = tabItems.map(([tab, text]) => {
    const isActivated = tab === props.activated;
    const isToday = new Date().getDay() === tab;
    const itemClassName = classNames(styles.item, {
      [styles.active]: isActivated,
      [styles.today]: isToday,
    });
    const buttonText = isToday ? '今天' : text;

    return (
      <button
        key={tab}
        className={itemClassName}
        type="button"
        role="tab"
        aria-selected={isActivated}
        disabled={disabled}
        onClick={() => {
          props.onClick && props.onClick(tab);
        }}
      >
        {buttonText}
      </button>
    );
  });
  const rootClassName = classNames(props.className, styles.root);

  return (
    <div role="tablist" className={rootClassName}>
      {buttons}
    </div>
  );
}
