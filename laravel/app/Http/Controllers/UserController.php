<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\User;
use Illuminate\Support\Facades\Hash;
use Exception;

class UserController extends Controller {

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {
        return view('create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserCreateRequest $request) {
        try {
            if (User::create([
                        'name'     => $request->input('name'),
                        'email'    => $request->input('email'),
                        'password' => Hash::make($request->input('password')),
                    ])) {
                return back()->with('success', Lang::get('custom.user_create_success'));
            }
            else {
                return back()->withErrors([
                            'message' => Lang::get('custom.user_create_error')
                ]);
            }
        }
        catch (Exception $ex) {
            return back()->withErrors([
                        'message' => $ex->getMessage()
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
        $user = User::find($id);
        return view('edit', compact('user', 'id'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserUpdateRequest $request, $id) {
        try {
            $user        = User::find($id);
            $user->name  = $request->input('name');
            $user->email = $request->input('email');
            if ($user->save()) {
                return back()->with('success', Lang::get('custom.user_update_success'));
            }
            else {
                return back()->withErrors([
                            'message' => Lang::get('custom.user_update_error')
                ]);
            }
        }
        catch (Exception $ex) {
            return back()->withErrors([
                        'message' => $ex->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        try {
            $user = User::find($id);

            if ($user->delete()) {
                return back()->with('success', Lang::get('custom.user_delete_success'));
            }
            else {
                return back()->withErrors([
                            'message' => Lang::get('custom.user_delete_error')
                ]);
            }
        }
        catch (Exception $ex) {
            return back()->withErrors([
                        'message' => $ex->getMessage()
            ]);
        }
    }

}
