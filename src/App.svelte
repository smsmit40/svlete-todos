<script>
  import { onMount } from "svelte";
  import { collection, getDocs, onSnapshot, addDoc, Timestamp, deleteDoc, where, limit, query, doc, updateDoc } from "firebase/firestore";
  import db from "./firebase";
  import {v4 as uuidv4} from 'uuid'
  let todos = [];
  let setDescription = '';
  let setDuedate = '';
  let setStatus = '';
  let setOverdue = false;
  let setEditedId;
  let editing = false;


  onMount(() => {
    onSnapshot(collection(db, "1"), (snapshot) => {
      todos = snapshot.docs;
    });
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editing){
      await updateDoc(doc(db, "1", setEditedId), {
        description: setDescription,
        status: setStatus,
        duedate: Timestamp.fromDate(new Date(setDuedate))
      })
      await clearForm()
      return
    }
    const newid = uuidv4()
    await addDoc(collection(db, "1"), {
      id: newid,
      description: setDescription,
      status: setStatus,
      duedate: Timestamp.fromDate(new Date(setDuedate)),
      isOverdue: false
    })
    await clearForm();
  };

  const deleteTask = async (todo) => {
    await deleteDoc(doc(db, "1", todo.id))
    // await deleteDoc((collection(db, "1", id)))
  }

  const updateTask = async (todo) => {
    setDescription = todo.data().description;
    setStatus = todo.data().status;
    setEditedId = todo.id;
    editing = true;
  }

  const clearForm = async (e) => {
    setEditedId = '';
    editing = false;
    setDescription = '';
    setDuedate = '';
    setStatus = '';
  }

  const checkOverdue = async (e) => {

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed)
    const q = query(collection(db, "1"), where("duedate", "<", Timestamp.fromDate(new Date(today)) ));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((todo) => {
      if (todo.data().status !== 'complete'){
           updateDoc(doc(db, "1", todo.id), {
            isOverdue: true,
        })
      }
    });
  };
</script>


<main>
<div class="h-screen">
  <div>
    <center><h1 class="text-2xl">Task Manager</h1></center>
  </div>

<!--  <center>-->


<!--  <form on:submit={handleSubmit} class="w-full max-w-sm">-->
<!--    <label for="description">Description:</label>-->
<!--    <input id="description" type="text" bind:value={setDescription} />-->
<!--    <br>-->
<!--    <select bind:value={setStatus}>-->
<!--      <option disabled value="">Please select Status!</option>-->
<!--      <option>created</option>-->
<!--      <option>in progress</option>-->
<!--      <option>hold</option>-->
<!--      <option>complete</option>-->
<!--    </select>-->
<!--    <br>-->
<!--    <label for="birthday">Due Date:</label>-->
<!--    <input bind:value={setDuedate} type="date" id="birthday">-->
<!--    <button class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300-->
<!--    font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:-->
<!--    ring-green-800"type="submit">Submit</button>-->
<!--  </form>-->
<!--  </center>-->

  <center>
    <div class="bg-gray-300 border-solid border-2 border-black flex-grow justify-center w-1/3 p-8">
      <form on:submit={handleSubmit}>
        <div class="mb-6">
          <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Description</label>
          <input bind:value={setDescription} type="text" id="description" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter Description of task" required>
        </div>
        <div class="mb-6">
          <label for="repeat-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Due Date: </label>
          <input bind:value={setDuedate} type="date" id="repeat-password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
        </div>
        <div class="mb-6">
          <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Please select status</label>
          <select bind:value={setStatus} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option>created</option>
            <option>in progress</option>
            <option>hold</option>
            <option>complete</option>
          </select>
        </div>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Task</button>
        <button type="button" class="text-white bg-yellow-400 hover:bg-yellow-500
  focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center
  me-2 mb-2 dark:focus:ring-yellow-900" on:click={clearForm}>Clear Form</button>
        <button type="button" class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300
  font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700
  dark:focus:ring-purple-900"on:click={checkOverdue}>Check For Overdue</button>
      </form>
    </div>
  </center>

  <br>
  <br>

<!--  <div class="flex justify-center my-16">-->
<!--  <button type="button" class="text-white bg-yellow-400 hover:bg-yellow-500-->
<!--  focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center-->
<!--  me-2 mb-2 dark:focus:ring-yellow-900" on:click={clearForm}>Clear Form</button>-->

<!--  <button type="button" class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300-->
<!--  font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700-->
<!--  dark:focus:ring-purple-900"on:click={checkOverdue}>Check For Overdue</button>-->
<!--  </div>-->
  <div class="flex justify-center">
    <table class="border border-slate-300 bg-white w-4/5 overflow-y-auto">
      <tr>
        <th>description</th>
        <th>Status</th>
        <th>Due Date</th>
        <th></th>
      </tr>
    {#each todos as todo (todo.data().id)}
      {#if todo.data().isOverdue}
      <tr class="text-red-600 font-semibold">
      <td class="border border-slate-300">
        {todo.data().description}
      </td>
        <td class="border border-slate-300">
          {todo.data().status}
        </td>
        <td class="border border-slate-300">
          {todo.data().duedate.toDate()}
        </td>
        <td class="border border-slate-300">
          <button class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300
          font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
          dark:focus:ring-red-900"on:click={deleteTask(todo)}>X</button>

        </td>
        <td class="border border-slate-300">
          <button class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br
          focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg
          text-sm px-5 py-2.5 text-center me-2 mb-2" on:click={updateTask(todo)}>Edit</button>
        </td>
      </tr>
        {:else if todo.data().status == 'complete'}
        <tr class="line-through">
          <td class="border border-slate-300">
            {todo.data().description}
          </td>
          <td class="border border-slate-300">
            {todo.data().status}
          </td>
          <td class="border border-slate-300">
            {todo.data().duedate.toDate()}
          </td>
          <td class="border border-slate-300">
            <button class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300
            font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
            dark:focus:ring-red-900" on:click={deleteTask(todo)}>X</button>
          </td>
          <td class="border border-slate-300">
            <button class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br
            focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg
            text-sm px-5 py-2.5 text-center me-2 mb-2" on:click={updateTask(todo)}>Edit</button>
          </td>
        </tr>
        { :else }
        <tr>
          <td class="border border-slate-300">
            {todo.data().description}
          </td>
          <td class="border border-slate-300">
            {todo.data().status}
          </td>
          <td class="border border-slate-300">
            {todo.data().duedate.toDate()}
          </td>
          <td class="border border-slate-300">
            <button class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300
            font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600
            dark:hover:bg-red-700 dark:focus:ring-red-900"on:click={deleteTask(todo)}>X</button>
          </td>
          <td class="border border-slate-300">
            <button class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br
            focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg
            text-sm px-5 py-2.5 text-center me-2 mb-2"on:click={updateTask(todo)}>Edit</button>
          </td>
        </tr>
        {/if}
    {/each}
    </table>
  </div>
</div>
</main>

<style>

</style>
