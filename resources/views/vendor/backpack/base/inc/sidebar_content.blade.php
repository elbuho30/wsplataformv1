<!-- This file is used to store sidebar items, starting with Backpack\Base 0.9.0 -->
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('dashboard') }}"><i class="la la-home nav-icon"></i> {{ trans('backpack::base.dashboard') }}</a></li>
@can('Gestión Comercial')
<li class="nav-title">GESTIÓN COMERCIAL</li>
    @can('Clientes')
    <li class='nav-item'><a class='nav-link' href='{{ backpack_url('clientes') }}'><i class='nav-icon la la-users'></i> Clientes</a></li>
    @endcan
@endcan
@can('Maestros')
<li class="nav-title">MAESTROS</li>
@can('Localización')
<li class="nav-item nav-dropdown"><a class="nav-link nav-dropdown-toggle parent-menu" href="#"><i class="nav-icon la la-lg la-globe"></i>Localización</a>
    <ul class="nav-dropdown-items">
        @can('Países')
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('paises') }}'><i class='nav-icon la la-flag'></i> Países</a></li>
        @endcan
        @can('Departamentos')
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('departamentos') }}'><i class='nav-icon la la-map'></i> Departamentos</a></li>
        @endcan
        @can('Ciudades')
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('ciudades') }}'><i class='nav-icon la la-map-marker'></i> Ciudades</a></li>
        @endcan
    </ul>
</li>
@endcan
@can('Entidad')
<li class="nav-item nav-dropdown"><a class="nav-link nav-dropdown-toggle parent-menu" href="#"><i class="nav-icon la la-lg la-institution"></i>Entidad</a>
    <ul class="nav-dropdown-items">
        @can('Parámetros')
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('parametros') }}'><i class='nav-icon la la-cogs'></i> Parámetros</a></li>
        @endcan
        @can('Oficinas')
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('oficinas') }}'><i class='nav-icon la la-building'></i> Oficinas</a></li>
        @endcan
    </ul>
</li>
@endcan
@can('Seguridad')
<li class="nav-item nav-dropdown">
    <a class="nav-link nav-dropdown-toggle parent-menu" href="#"><i class="nav-icon la la-users"></i>Seguridad</a>
    <ul class="nav-dropdown-items">
        <li class="nav-item"><a class="nav-link" href="{{ backpack_url('user') }}"><i class="nav-icon la la-user"></i><span>Usuarios</span></a></li>
        <li class="nav-item"><a class="nav-link" href="{{ backpack_url('role') }}"><i class="nav-icon la la-id-badge"></i><span>Roles</span></a></li>
        <li class="nav-item"><a class="nav-link" href="{{ backpack_url('permission') }}"><i class="nav-icon la la-key"></i><span>Permisos</span></a></li>
    </ul>
</li>
@endcan
@endcan