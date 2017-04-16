let domoRenderer;
let domoForm;
let DomoFormClass;
let DomoListClass;

const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
        
    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("All fields are required");
        return false;
    }   
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function(){
      domoRenderer.loadDomosFromServer();
    });
    
    return false;
}

const renderDomo = function(){
    return(
    <form id="domoForm"            
          name ="domoForm"
          onSubmit = {this.handleSubmit}
          action = "/maker"
          method = "POST"
          className = "domoForm">
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <input type="hidden" name="_csrf" value={this.props.csrf}/>
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
    </form>
    );
};

const renderDomoList = function(){
    if(this.state.data.length === 0){
        return (
        <div className="domoList">
          <h3 className ="emptyDomo"> No Domos yet</h3>
        </div>
        );
    }
    
    const domoNodes = this.state.data.map(function(domo){
        return(
        <div key={domo._id} className="domo">
          <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
          <h3 className="domoName">Name:{domo.name}</h3>
          <h3 className="domoAge">Age:{domo.age}</h3>
        </div>
        );
    });
    
    return (
      <div className="domoList">
        {domoNodes}
      </div>
    );
};

const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({width:'toggle'},350);
}

const sendAjax = (action, data) => {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: (result, status, xhr) => {
      $("#domoMessage").animate({width:'hide'},350);

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });        
}

$(document).ready(() => {
  $("#signupForm").on("submit", (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("All fields are required");
      return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
      handleError("Passwords do not match");
      return false;           
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

    return false;
  });

  $("#loginForm").on("submit", (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("sername or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

    return false;
  });
  
  $("#domoForm").on("submit", (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
      handleError("All fields are required");
      return false;
    }

    sendAjax($("#domoForm").attr("action"), $("#domoForm").serialize());

    return false;
  });
});

const setup = function(csrf) {
  DomoFormClass = React.createClass({
      handleSubmit: handleDomo,
      render: renderDomo,
  });
  
  DomoListClass = React.createClass({
      loadDomosFromServer: function(){
        sendAjax('GET', '/getDomos', null, function(data) {
            this.setState({data:data.domos});
        }.bind(this))
      },
      getInitialState: function(){
          return {data: []};
      },
      componentDidMount: function(){
          this.loadDomosFromServer();
      },
      render: renderDomoList
  });
  
  domoForm = ReactDOM.render(
    <DomoFormClass csrf={csrf}/>, document.querySelector("#makeDomo")
    );
    
  domoRenderer = ReactDOM.render(
    <DomoListClass />, document.querySelector("#domos")
    );
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);});
}

$(document).ready(function() {
    getToken();
});