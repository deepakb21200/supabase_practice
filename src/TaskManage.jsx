import React, { useEffect, useState } from 'react'
import { supabase } from './supabase-client'
function TaskManage({session}) {
    
    
      const [newTask, setNewTask] = useState({ title: '', description: '' })
      const [updateTask, setUpdateTask] = useState({ title: '', description: '' })
      const [tasks, setTasks] = useState([])
      const [taskImage, setTaskImage] = useState(null)
    
    
    async  function  handleSubmit(e){
        e.preventDefault()
  

        let imageUrl = null;

if (taskImage) {
  imageUrl = await uploadImageToBucket(taskImage);
}
     let {data,error} = await supabase.from("tasks").insert({...newTask, email:session.user.email, image_url:imageUrl}).select().single()
        // .insert  me multiple objects hum desakte hai.
    
        if(data){
          setNewTask({title:"", description:""})
        }

    
      }
    
    
        const fetchTasks = async() => {
        const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true })
    
    
        if(error){
          console.log('Error: ', error)
        }
        setTasks(data)
      }
    
    
      useEffect(()=>{
    fetchTasks()
      },[])

      useEffect(() => {
  const myChannel = supabase.channel('tasks-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'tasks' },
      (payload) => {
        const newTask = payload.new; 
        console.log("newtask", newTask);  
        setTasks((prev) => [...prev, newTask]);
      }
    )
    .subscribe((status) => {
      console.log('Subscription: ', status);
    });

  return () => {
    supabase.removeChannel(myChannel);
  };
}, []);

 
    
// useEffect(() => {
//   const channel = supabase.channel('tasks-channel')
//     .on('postgres_changes', 
//         { event: 'INSERT', schema: 'public', table: 'tasks' },
//         (payload) => {
//           console.log("New task inserted:", payload.new);  
//           setTasks(prev => [...prev, payload.new]); // add new task to state
//         }
//     )
//     .subscribe(status => console.log('Channel status:', status));

//   return () => {
//     supabase.removeChannel(channel);
//   };
// }, []);

    
      const uploadImageToBucket = async (file) => {
  const filePath = `${file.name}-${Date.now()}`;

  const { error } = await supabase
    .storage
    .from('tasks-bucket')
    .upload(filePath, file);

  if (error) {
    console.error('Error:', error.message);
    return null;
  }

  const { data } =   supabase
    .storage
    .from('tasks-bucket')
    .getPublicUrl(filePath);

  return data.publicUrl;
};




      function handleFileChange(e){
         if(e.target.files && e.target.files.length > 0){
      setTaskImage(e.target.files[0])
    }
    
      }
    
      function changeHandler(e){
            const name = e.target.name;
        const val = e.target.value;
        setNewTask((prev) => ({
          ...prev,
          [name]: val
        }))
      }
    
      async function handleUpdateSubmit(e,id){
           e.preventDefault()
    
        const { data } = await supabase.from('tasks').update({ title:updateTask.title, description: updateTask.description }).eq('id', id)
    
        if(data){
          console.log('Success')
        }
    
      }
    
    
      function updateHandler(e){
          const name = e.target.name;
        const val = e.target.value;
        setUpdateTask((prev) => ({
          ...prev,
          [name]: val
        }))
    
      }
    
    
     async function deleteTaskHandler(id){
           const { data } = await supabase.from('tasks').delete().eq('id', id)
    
        if(data){
          console.log('Success')
        }
    
      }
    
    
      async function deleteTask(id){ 
            const { data, error } = await supabase.from('tasks').delete().eq('id', id)
        if(data){
          console.log('Success')
        }
    
      }
  return (
     <div className="task-container">
    <h1 className="task-title">Task Manager</h1>

    {/* Form */}
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={newTask.title}
        onChange={changeHandler}
        name="title"
        placeholder="Task Title"
        className="task-input"
      />
      <textarea
        placeholder="Task Description"
        value={newTask.description}
        name="description"
        onChange={changeHandler}
        className="task-textarea"
      />


      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button type="submit" className="task-button">
        Add Task
      </button>
    </form>

    {/* Task List */}
    <div className="task-list">

      {tasks?.map(task => <div key={task.id} className="task-card">
        <div className="task-info">
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <img src={task.image_url} alt={task.title}  style={{width:"100px"}}/>
          <form onSubmit={(e) => handleUpdateSubmit(e, task.id)} className="task-form">
            <input  
              type="text"
              value={updateTask.title}
              onChange={updateHandler}
              name="title"
              placeholder="Task Title"
              className="task-input"
            />
            <textarea
              placeholder="Task Description"
              value={updateTask.description}
              name="description"
              onChange={updateHandler}
              className="task-textarea"
            />
            <button type="submit" className="task-button">
              Update Task
            </button>
          </form>
        </div>
        <div className="task-actions">
          <button className="edit-btn" onClick={() => deleteTaskHandler(task.id)}>Edit</button>
          <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      </div>)}

    </div>
  </div>
  )
}

export default TaskManage