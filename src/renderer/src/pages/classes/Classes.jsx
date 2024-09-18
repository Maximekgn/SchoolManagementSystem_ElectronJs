import React, { useEffect, useState } from 'react';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [newTeacherId, setNewTeacherId] = useState('');

  const fetchClasses = async () => {
    try {
      const data = await window.electron.ipcRenderer.invoke('get-classes');
      setClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const addClass = async () => {
    try {
      const newClass = {
        name: newClassName,
        teacherId: newTeacherId,
      };
      const result = await window.electron.ipcRenderer.invoke('add-class', newClass);
      setClasses([...classes, result]);
      setNewClassName('');
      setNewTeacherId('');
    } catch (err) {
      console.error('Error adding class:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div>
      <h1>Classes</h1>
      <input
        type="text"
        value={newClassName}
        onChange={(e) => setNewClassName(e.target.value)}
        placeholder="Class Name"
      />
      <input
        type="number"
        value={newTeacherId}
        onChange={(e) => setNewTeacherId(e.target.value)}
        placeholder="Teacher ID"
      />
      <button onClick={addClass}>Add Class</button>
      
      {classes.length === 0 ? (
        <p>No classes available</p>
      ) : (
        <ul>
          {classes.map((classItem) => (
            <li key={classItem.id}>{classItem.name} (Teacher ID: {classItem.teacher_id})</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Classes;
