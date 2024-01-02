use ic_cdk_macros::{update, query, pre_upgrade, post_upgrade};
use candid::{CandidType, Deserialize};
use std::cell::RefCell;

type UserId = String;

#[derive(CandidType, Deserialize, Clone, Debug)]
struct User {
    id: UserId,
    name: String,
    email: String,
    picture: String,
    // other fields as needed
}

#[derive(Default, CandidType, Deserialize, Clone, Debug)]
struct State {
    users: Vec<User>,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[update]
fn create_user(user: User) {
    STATE.with(|state| {
        state.borrow_mut().users.push(user);
    });
    ic_cdk::api::print("User created successfully");
}

#[query]
fn get_user(id: UserId) -> Option<User> {
    STATE.with(|state| state.borrow().users.iter().find(|u| u.id == id).cloned())
}
