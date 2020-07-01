import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub';
import { createTodo } from './graphql/mutations'

import awsconfig from './aws-exports';
API.configure(awsconfig);
PubSub.configure(awsconfig);

async function createNewTodo() {
  const todo = { name: "From Amplify" , description: "Saved from frontend"}
  return await API.graphql(graphqlOperation(createTodo, { input: todo }))
}

const MutationButton = document.getElementById('MutationEventButton');
const MutationResult = document.getElementById('MutationResult');

MutationButton.addEventListener('click', (evt) => {
  MutationResult.innerHTML = `MUTATION RESULTS:`;
  createNewTodo().then( (evt) => {
    console.log(evt);
    const mutations = JSON.stringify(evt.data);
    MutationResult.innerHTML = `MUTATION RESULTS: ${mutations}`
  })
});

// other imports
import { listTodos } from './graphql/queries'

const QueryResult = document.getElementById('QueryResult');

async function getData() {
  QueryResult.innerHTML = `NOTIFICATION LIST`;
  API.graphql(graphqlOperation(listTodos)).then((evt) => {
    evt.data.listTodos.items.map((todo, i) => 
    QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`
    );
  })
}

getData();

// other imports
import { onCreateTodo } from './graphql/subscriptions'

const SubscriptionResult = document.getElementById('SubscriptionResult');

API.graphql(graphqlOperation(onCreateTodo)).subscribe({
  next: (evt) =>{
    console.log(evt);
    const todo = JSON.stringify(evt.value.data.onCreateTodo);
     SubscriptionResult.innerHTML = `SUBSCRIPTION RESULTS : ${todo}`
    //  SubscriptionResult.innerHTML = `SUBSCRIPTION RESULTS : `

    // const todo = evt.value.data.onCreateTodo;
    // SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`
  }
});