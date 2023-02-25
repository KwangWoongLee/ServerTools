import React from 'react';

import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import { FormControl, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import { FcCalendar } from 'react-icons/fc';
import { logger } from 'util/com';

const DateTimeInput = ({ selectDate, minDate, maxDate, onChange, placeholder }) => {
  logger.render('DateTimeInput : ', selectDate);

  return (
    <DatePicker
      dateFormat="yyyy-MM-dd HH:mm"
      selected={selectDate}
      onChange={onChange}
      locale={ko}
      minDate={minDate}
      maxDate={maxDate}
      showTimeSelect
      timeIntervals={30}
      customInput={
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FcCalendar />
          </InputGroup.Text>
          <FormControl
            type="text"
            placeholder={placeholder}
            className="bg-light"
            readOnly
            value={selectDate ? moment(selectDate).format('YYYY-MM-DD HH:mm') : ''}
          />
        </InputGroup>
      }
    />
  );
};

export default React.memo(DateTimeInput);
