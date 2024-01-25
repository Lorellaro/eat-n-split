import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddfriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(!showAddfriend);
  }

  function handleSelectFriend(friend) {
    if (selectedFriend === friend) {
      setSelectedFriend(null);
      return;
    }
    setSelectedFriend(friend);
    setShowAddFriend(false);
  }

  function handleAddFriend(newFriend) {
    const newFriendsList = [...friends, newFriend];
    setFriends(newFriendsList);
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          handleSelectFriend={handleSelectFriend}
          friendList={friends}
          selectedFriend={selectedFriend}
        />
        {showAddfriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddfriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ handleSelectFriend, friendList, selectedFriend }) {
  return (
    <ul>
      {friendList.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
      ;
    </ul>
  );
}

function Friend({ friend, handleSelectFriend, selectedFriend }) {
  return (
    <li className={friend === selectedFriend ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You Owe {friend.name} £{friend.balance * -1}
          {friend.balance % 1 === 0 && <>.00</>}.
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} Owes You £{friend.balance}
          {friend.balance % 1 === 0 && <>.00</>}.
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even!</p>}

      <Button onClick={() => handleSelectFriend(friend)}>
        {" "}
        {selectedFriend !== friend ? "Select" : "Close"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>- Friend Name</label>{" "}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>- Image URL</label>{" "}
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [totalBill, setTotalBill] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = totalBill ? totalBill - amountPaid : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!totalBill || !amountPaid) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -amountPaid);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>+ Bill Value</label>{" "}
      <input
        type="text"
        value={totalBill}
        onChange={(e) => setTotalBill(Number(e.target.value))}
      ></input>
      <label>- Your Expense</label>{" "}
      <input
        type="text"
        value={amountPaid}
        onChange={(e) =>
          setAmountPaid(
            Number(e.target.value) > totalBill
              ? amountPaid
              : Number(e.target.value)
          )
        }
      ></input>
      <label>= {selectedFriend.name}'s Expense</label>{" "}
      <input type="text" value={paidByFriend} disabled></input>
      <label>- Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
