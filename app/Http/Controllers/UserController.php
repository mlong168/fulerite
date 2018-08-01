<?php

namespace App\Http\Controllers;

use App\User;
use App\Datasource;
use Auth;
use Bican\Roles\Models\Permission;
use Bican\Roles\Models\Role;
use Hash;
use Illuminate\Http\Request;
use Input;
use Validator;
use DB;
use Config;

class UserController extends Controller
{
    /**
     * Get user current context.
     *
     * @return JSON
     */
    public function getMe()
    {
        $user = Auth::user();

        return response()->success($user);
    }

    /**
     * Update user current context.
     *
     * @return JSON success message
     */
    public function putMe(Request $request)
    {
        $user = Auth::user();

        $this->validate($request, [
            'data.name' => 'required|min:3',
            'data.email' => 'required|email|unique:users,email,'.$user->id,
        ]);

        $userForm = app('request')
                    ->only(
                        'data.current_password',
                        'data.new_password',
                        'data.new_password_confirmation',
                        'data.name',
                        'data.email'
                    );

        $userForm = $userForm['data'];
        $user->name = $userForm['name'];
        $user->email = $userForm['email'];

        if ($request->has('data.current_password')) {
            Validator::extend('hashmatch', function ($attribute, $value, $parameters) {
                return Hash::check($value, Auth::user()->password);
            });

            $rules = [
                'data.current_password' => 'required|hashmatch:data.current_password',
                'data.new_password' => 'required|min:8|confirmed',
                'data.new_password_confirmation' => 'required|min:8',
            ];

            $payload = app('request')->only('data.current_password', 'data.new_password', 'data.new_password_confirmation');

            $messages = [
                'hashmatch' => 'Invalid Password',
            ];

            $validator = app('validator')->make($payload, $rules, $messages);

            if ($validator->fails()) {
                return response()->error($validator->errors());
            } else {
                $user->password = Hash::make($userForm['new_password']);
            }
        }

        $user->save();

        return response()->success('success');
    }

    /**
     * Get all users.
     *
     * @return JSON
     */
    public function getIndex()
    {
        $users = User::all();

        return response()->success(compact('users'));
    }

    /**
     * Get user details referenced by id.
     *
     * @param int User ID
     *
     * @return JSON
     */
    public function getShow($id)
    {
        $user = User::find($id);
        $user['role'] = $user
                        ->roles()
                        ->select(['slug', 'roles.id', 'roles.name'])
                        ->get();

        return response()->success($user);
    }

    /**
     * Update user data.
     *
     * @return JSON success message
     */
    public function putShow(Request $request)
    {
        $userForm = array_dot(
            app('request')->only(
                'data.name',
                'data.email',
                'data.id'
            )
        );

        $userId = intval($userForm['data.id']);

        $user = User::find($userId);

        $this->validate($request, [
            'data.id' => 'required|integer',
            'data.name' => 'required|min:3',
            'data.email' => 'required|email|unique:users,email,'.$user->id,
        ]);

        $userData = [
            'name' => $userForm['data.name'],
            'email' => $userForm['data.email'],
        ];

        $affectedRows = User::where('id', '=', $userId)->update($userData);

        $user->detachAllRoles();

        foreach (Input::get('data.role') as $setRole) {
            $user->attachRole($setRole);
        }

        return response()->success('success');
    }

    /**
     * Delete User Data.
     *
     * @return JSON success message
     */
    public function deleteUser($id)
    {
        // $user = User::find($id);
        // $user->delete();
        return response()->success('success');
    }

    /**
     * Get all user roles.
     *
     * @return JSON
     */
    public function getRoles()
    {
        $roles = Role::all();

        return response()->success(compact('roles'));
    }

    /**
     * Get role details referenced by id.
     *
     * @param int Role ID
     *
     * @return JSON
     */
    public function getRolesShow($id)
    {
        $role = Role::find($id);

        $role['permissions'] = $role
                        ->permissions()
                        ->select(['permissions.name', 'permissions.id'])
                        ->get();

        return response()->success($role);
    }

    /**
     * Update role data and assign permission.
     *
     * @return JSON success message
     */
    public function putRolesShow()
    {
        $roleForm = Input::get('data');
        $roleData = [
            'name' => $roleForm['name'],
            'slug' => $roleForm['slug'],
            'description' => $roleForm['description'],
        ];

        $roleForm['slug'] = str_slug($roleForm['slug'], '.');
        $affectedRows = Role::where('id', '=', intval($roleForm['id']))->update($roleData);
        $role = Role::find($roleForm['id']);

        $role->detachAllPermissions();

        foreach (Input::get('data.permissions') as $setPermission) {
            $role->attachPermission($setPermission);
        }

        return response()->success('success');
    }

    /**
     * Create new user role.
     *
     * @return JSON
     */
    public function postRoles()
    {
        $role = Role::create([
            'name' => Input::get('role'),
            'slug' => str_slug(Input::get('slug'), '.'),
            'description' => Input::get('description'),
        ]);

        return response()->success(compact('role'));
    }

    /**
     * Get all datasources.
     *
     * @return JSON
     */
    public function getDatasources()
    {
        $datasources = Datasource::all();

        return response()->success(compact('datasources'));
    }
    /**
     * Create new datasource.
     *
     * @return JSON
     */
    public function postDatasources()
    {
        $datasource = new Datasource();
        try {
            $datasource->driver = Input::get('driver');
            $datasource->alias = Input::get('alias');
            $datasource->db_name = Input::get('db_name');
            $datasource->username = Input::get('username');
            $datasource->password = Input::get('password');
            $datasource->port = Input::get('port');
            $datasource->save();
        } catch(\Exception $e){
           return response()->success($e->getMessage());
        }    

        return response()->success('success');
    }
    /**
     * Update datasource data and assign permission.
     *
     * @return JSON success message
     */
    public function putDatasourcesShow()
    {
        $datasourceForm = Input::get('data');
        $datasourceData = [
            'driver' => $datasourceForm['driver'],
            'alias' => $datasourceForm['alias'],
            'db_name' => $datasourceForm['db_name'],
            'username' => $datasourceForm['username'],
            'password' => $datasourceForm['password'],
            'port' => $datasourceForm['port'],
        ];

        $affectedRows = Datasource::where('id', '=', intval($datasourceForm['id']))->update($datasourceData);

        return response()->success('success');
    }
    /**
     * Get datasource referenced by id.
     *
     * @param int Role ID
     *
     * @return JSON
     */
    public function getDatasourcesShow($id)
    {
        $datasource = Datasource::find($id);

        return response()->success($datasource);
    }
    /**
     * Delete datasource referenced by id.
     *
     * @param int datasource ID
     *
     * @return JSON
     */
    public function deleteDatasources($id)
    {
        Datasource::destroy($id);

        return response()->success('success');
    }
    /**
     * Delete user role referenced by id.
     *
     * @param int Role ID
     *
     * @return JSON
     */
    public function deleteRoles($id)
    {
        Role::destroy($id);

        return response()->success('success');
    }

    /**
     * Get all system permissions.
     *
     * @return JSON
     */
    public function getPermissions()
    {
        $permissions = Permission::all();

        return response()->success(compact('permissions'));
    }

    /**
     * Create new system permission.
     *
     * @return JSON
     */
    public function postPermissions()
    {
        $permission = Permission::create([
            'name' => Input::get('name'),
            'slug' => str_slug(Input::get('slug'), '.'),
            'description' => Input::get('description'),
        ]);

        return response()->success(compact('permission'));
    }

    /**
     * Get system permission referenced by id.
     *
     * @param int Permission ID
     *
     * @return JSON
     */
    public function getPermissionsShow($id)
    {
        $permission = Permission::find($id);

        return response()->success($permission);
    }

    /**
     * Update system permission.
     *
     * @return JSON
     */
    public function putPermissionsShow()
    {
        $permissionForm = Input::get('data');
        $permissionForm['slug'] = str_slug($permissionForm['slug'], '.');
        $affectedRows = Permission::where('id', '=', intval($permissionForm['id']))->update($permissionForm);

        return response()->success($permissionForm);
    }

    /**
     * Delete system permission referenced by id.
     *
     * @param int Permission ID
     *
     * @return JSON
     */
    public function deletePermissions($id)
    {
        Permission::destroy($id);

        return response()->success('success');
    }
     /**
     * Create new datafeed.
     *
     * @return JSON
     */
    public function postDatafeed()
    {
        $alias = Input::get('datasource');
        $sql_param = Input::get('sql');

        $dataSync = Datasource::where('alias', '=', $alias)->first();
        $driver = $dataSync->driver;

        Config::set('database.connections.' . $driver, array(
                'driver'    => $driver,
                'host'      => 'localhost',
                'database'  => $dataSync->db_name,
                'username'  => $dataSync->username,
                'password'  => $dataSync->password,
                'charset'   => 'utf8',
                'collation' => 'utf8_general_ci',
                'prefix'    => '',
        ));

        //$sql_param = 'select * from fuelsite limit 10;';
        $response = DB::connection($driver)->select($sql_param);

        return response()->success(compact('response'));
    }
}
