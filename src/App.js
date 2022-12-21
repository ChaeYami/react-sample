
import './App.css';
import { useState } from 'react';

function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Header(props){
  return <header> 

    <h1><a href="/" onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode();
        }}>{props.title}</a></h1>

  </header>
}

function Nav(props){
  const lis = []
  for(let i=0; i < props.topics.length; i++){ 
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id ={t.id} href={'/read/'+t.id} onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
                            // event.target(a tag)의id -숫자로 받았으나 태그의 속성이 되어 문자가 됨. 따라서 Number()를 사용해 숫자로 다시 converting
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
      // content = <Create onCreate={(_title, _body)=> 실행
    }}>
      <p><input type='text' name="title" placeholder='title'/></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type='submit' value='Create'></input></p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.title);
  return <article>
  <h2>Update</h2>
  <form onSubmit={event=>{
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onUpdate(title, body);
    // content = <Update onUpdate={(_title, _body)=> 실행
  }}>
    <p><input type='text' name="title" placeholder='title' value={title} onChange={event=>{
      setTitle(event.target.value);
    }}/></p>
    <p><textarea name='body' placeholder='body' value={body} onChange={event=>{
      setBody(event.target.value);
    }}></textarea></p>
    <p><input type='submit' value='Update'></input></p>
    </form>
  </article>
}

function App() {
  // const _mode = useState('WELCOME'); // 상태를 만듦, _mode : 상태의 결과
  // const mode=_mode[0]; // useState 0번째 : 상태의 값을 읽을 때 쓰는 데이터
  // const setMode= _mode[1]; // 1번째 : 값을 변경할 때 사용하는 함수 
  ////***아래랑 같다***
  const [mode, setMode] = useState('WELCOME'); 
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics,setTopics] =useState( [
    {id:1, title:'First-list', body:'main text 1' },
    {id:2, title:'Second-list', body:'main text 2' },
    {id:3, title:'Third-list', body:'main text 3' }
  ] );
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Made using React."></Article>
  } else if(mode === 'READ') {
    let title, body = null;
    for(let i = 0 ; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title; 
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>

      <li><a href = {"/update/" +id} onClick={(event)=>{
        event.preventDefault();
        setMode('UPDATE')
      }} >Update</a></li>
      <li><input type="button" value='Delete' onClick={()=>{
        const newTopics = []
        for(let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode("WELCOME");
      }}></input></li>

    </>

  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId , title:_title , body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1); //88~89 참고
    }}></Create>

  } else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i = 0 ; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title; 
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate = {(_title,_body)=>{
      const updatedTopic = {id:id, title:_title, body:_body}
      const newTopics = [...topics]
      for (let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics)
      setMode('READ');
    }}></Update>
  }

  return (
    <div className="App">

      <Header title="TITLE" onChangeMode={()=>{
        setMode ('WELCOME'); // [1]번째 : [0]번째 값 WELCOME으로 변경
        }}></Header>
                        
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode ('READ'); // [1]번째 : [0]번째 값 READ 으로 변경
        setId(_id);
        }}></Nav>
                    {/* 여기 _id는  위에 id랑 별개로, 위에서 받은 변수(t.id)를 _id에 저장해 이 함수에서만 쓴당 */}
      {content}

      <ul>

        <li><a href="/create" onClick={event=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>

        {contextControl}

      </ul>

    </div>
  );
}

export default App;
