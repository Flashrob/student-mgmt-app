import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

export default function LessonDetails({ lesson, setIsEditMode }) {
  const [studentList, setStudentList] = useState([]);
  const [studentId, setStudentId] = useState(lesson.contractId);
  const [studentMessage, setStudentMessage] = useState('');
  const [details, setDetails] = useState(lesson.details);
  const [detailsMessage, setDetailsMessage] = useState('');
  const [date, setDate] = useState(moment(lesson.lessonDate).format('YYYY-MM-DD'));
  const [dateMessage, setDateMessage] = useState('');

  useEffect(async () => {
    try {
      const { data } = await axios.get('/students/active');
      const studentsJsx = data.map((el) => (
        <option key={el.id} value={el.id}>
          {el.studentName}
        </option>
      ));
      setStudentList(studentsJsx);
    } catch (err) {
      console.log(err.response.data);
    }
  }, []);

  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
  };

  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // TODO: date validation

  const checkBlank = () => {
    let hasBlank = false;
    if (studentId === '') {
      setStudentMessage('Please choose a student');
      hasBlank = true;
    }
    if (details === '') {
      setDetailsMessage('Please fill the lesson details');
      hasBlank = true;
    }
    if (date === '') {
      setDateMessage('Please fill in the date');
      hasBlank = true;
    }
    return hasBlank;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkBlank()) return;
    try {
      const { data } = await axios.put(`/lesson/${lesson.id}`, {
        studentId, details, date,
      });
      if (data.success) {
        setIsEditMode(false);
      }
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div>
      <form>
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" value={date} onChange={handleDateChange} />
        <span>{dateMessage}</span>
        <br />
        <label htmlFor="student-id">Student:</label>
        <select id="student-id" onChange={handleStudentIdChange} value={studentId}>
          <option value="">Choose Student</option>
          {studentList}
        </select>
        <span>{studentMessage}</span>
        <br />
        <label htmlFor="details">Details:</label>
        <textarea type="text" id="details" value={details} onChange={handleDetailsChange} />
        <span>{detailsMessage}</span>
        <br />
        <button type="submit" onClick={handleSubmit}>Edit Lesson</button>
      </form>
    </div>
  );
}
