<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\ClientesRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use App\Models\User;

/**
 * Class ClientesCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class ClientesCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    public function setup()
    {
        $this->crud->setModel('App\Models\Clientes');
        $this->crud->setRoute(config('backpack.base.route_prefix') . '/clientes');
        $this->crud->setEntityNameStrings('cliente', 'clientes');
    }

    protected function setupListOperation()
    {
        // TODO: remove setFromDb() and manually define Columns, maybe Filters
        //$this->crud->setFromDb();
        $this->crud->enableExportButtons();

        // FILTROS

         // Filtro estado
         $this->crud->addFilter(
            [
                'name'  => 'estado',
                'type'  => 'dropdown',
                'label' => 'Estado'
            ],
            [
                '1' => 'Activo',
                '0' => 'Inactivo',
            ],
            function ($value) { // if the filter is active
                $this->crud->addClause('where', 'estado', $value);
            }
        );

        $this->crud->addFilter(
            [
                'name' => 'name',
                'type' => 'select2_multiple',
                'label' => 'Usuario Reg. '
            ],
            function () { // the options that show up in the select2
                return User::all()->sortBy('name')->pluck('name', 'id')->toArray();
            },
            function ($values) { // if the filter is active
                $this->crud->addClause('whereIn', 'user_id', json_decode($values));
            }
        );


        CRUD::addColumn([
            'name' => 'nro_documento',
            'type' => 'text',
            'label' => 'Nro. Documento',
        ]);

        CRUD::addColumn([
            'name' => 'nombres',
            'type' => 'text',
            'label' => 'Nombres',
        ]);

        CRUD::addColumn([
            'name' => 'apellidos',
            'label' => 'Apellidos',
            'type'  => 'text',
        ]);

        // Agrega la columna de celular
        CRUD::addColumn([
            'name' => 'celular',
            'label' => 'Celular',
            'type'  => 'phone',
            'searchLogic' => 'text',
        ]);

        // Agrega la columna de email
        CRUD::addColumn([
            'name' => 'email',
            'label' => 'Email',
            'type'  => 'email',
        ]);

        CRUD::addColumn([
            'name'    => 'estado',
            'label'   => 'Estado',
            'type'    => 'select_from_array',
            'options' => [
                '1' => 'Activo',
                '0' => 'Inactivo',
            ],
        ]);

        CRUD::addColumn([
            'name'    => 'user_id',
            'label'   => 'Usuario Reg.',
            'type'    => 'relationship',
            'attribute' => 'name',
            'entity' => 'clientesUsuarios',
        ]);
    }

    protected function setupCreateOperation()
    {
        $this->crud->setValidation(ClientesRequest::class);

        // TODO: remove setFromDb() and manually define Fields
        //$this->crud->setFromDb();
        dump(env('MAPS_GOOGLE_MAPS_ACCESS_TOKEN'));
        $entry = $this->crud->getCurrentEntry();
        CRUD::addField([
            'name' => 'nro_documento',
            'label' =>  'Nro. Documento',
            'type' => 'number',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);

         CRUD::addField([
            'name' => 'nombres',
            'label' =>  'Nombres',
            'type' => 'text',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);
        
        CRUD::addField([
            'name' => 'apellidos',
            'label' =>  'Apellidos',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);

        CRUD::addField([
            'name' => 'direccion',
            'label' => 'Dirección',
            'type' => 'address_google',            
            'store_as_json' => true,
            'wrapper' => [
                'class' => 'form-group col-md-4'
            ],
        ]);

        CRUD::addField([
            'name' => 'celular',
            'label' =>  'Celular',
            'type' => 'number',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);

        CRUD::addField([
            'name' => 'email',
            'label' =>  'Email',
            'type' => 'email',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);

        CRUD::addField([
            'name'  => 'estado',
            'label' => 'Estado',
            'type'    => 'select_from_array',
            'options' => [
                '0' => 'Inactivo',
                '1' => 'Activo',
            ],
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ]            
        ]);

        CRUD::addField([
            'name' => 'usuario_id',
            'type' => 'relationship',
            'label' => 'Usuario Reg.',
            'attribute' => 'name',
            'entity'    => 'clientesUsuarios',
            'allows_null' => true,
            'wrapper' => [
                'class' => 'form-group col-md-6'
            ],
        ]);
    }

    protected function setupUpdateOperation()
    {
        //$this->setupCreateOperation();
    $entry = $this->crud->getCurrentEntry();
        CRUD::addField([
            'name' => 'nro_documento',
            'label' =>  'Nro. Documento',
            'type' => 'number',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);

         CRUD::addField([
            'name' => 'nombres',
            'label' =>  'Nombres',
            'type' => 'text',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);
        
        CRUD::addField([
            'name' => 'apellidos',
            'label' =>  'Apellidos',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);

        CRUD::addField([
            'name' => 'direccion',
            'label' => 'Dirección',
            'type' => 'address_google',            
            'store_as_json' => true,
            'wrapper' => [
                'class' => 'form-group col-md-4'
            ],
        ]);

        CRUD::addField([
            'name' => 'celular',
            'label' =>  'Celular',
            'type' => 'number',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);

        CRUD::addField([
            'name' => 'email',
            'label' =>  'Email',
            'type' => 'email',
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ],
        ]);

        CRUD::addField([
            'name'  => 'estado',
            'label' => 'Estado',
            'type'    => 'select_from_array',
            'options' => [
                '0' => 'Inactivo',
                '1' => 'Activo',
            ],
            'wrapper' => [
                'class' => 'form-group col-md-3'
            ]            
        ]);

        CRUD::addField([
            'name' => 'usuario_id',
            'type' => 'relationship',
            'label' => 'Usuario Reg.',
            'attribute' => 'name',
            'entity'    => 'clientesUsuarios',
            'allows_null' => true,
            'wrapper' => [
                'class' => 'form-group col-md-6'
            ],
        ]);
    }
}
