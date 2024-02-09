// src/cosmicrafts_icp_backend/src/lib.rs
use candid::{CandidType, Principal};
use ic_cdk::api;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

type UserId = Principal;

#[derive(CandidType, Clone, Debug, Deserialize, Serialize, Eq, PartialEq)]
struct User {
    id: UserId,
    username: String,
}

#[derive(Default, CandidType, Deserialize, Clone, Debug)]
struct State {
    users: Vec<User>,
}

#[derive(CandidType, Deserialize)]
enum OperationResult {
    Success,
    Error(String),
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[update]
fn create_user(user: User) -> OperationResult {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let exists = state.users.iter().any(|u| u.id == user.id || u.username == user.username);
        if !exists {
            state.users.push(user.clone());
            ic_cdk::api::print(format!("User created successfully: {:?}", user));
            OperationResult::Success
        } else {
            OperationResult::Error("User already exists.".to_string())
        }
    })
}

#[update]
fn update_user(id: UserId, new_username: String) {
    let caller = api::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(user) = state.users.iter_mut().find(|u| u.id == id && id == caller) {
            user.username = new_username;
            ic_cdk::api::print("User updated successfully.");
        } else {
            ic_cdk::api::print("User not found or unauthorized.");
        }
    });
}

#[query]
fn get_user(id: UserId) -> Option<User> {
    STATE.with(|state| state.borrow().users.iter().find(|u| u.id == id).cloned())
}

#[query]
fn get_all_users() -> Vec<User> {
    STATE.with(|state| state.borrow().users.clone())
}

#[update]
fn delete_user(id: UserId) {
    let caller = api::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(index) = state.users.iter().position(|u| u.id == id && id == caller) {
            state.users.remove(index);
            ic_cdk::api::print("User deleted successfully.");
        } else {
            ic_cdk::api::print("User not found or unauthorized.");
        }
    });
}

#[update]
fn delete_all_users() {
    // This function is potentially very powerful/dangerous. Consider security implications.
    STATE.with(|state| {
        state.borrow_mut().users.clear();
        ic_cdk::api::print("All users deleted successfully.");
    });
}