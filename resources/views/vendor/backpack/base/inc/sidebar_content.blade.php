<!-- This file is used to store sidebar items, starting with Backpack\Base 0.9.0 -->
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('dashboard') }}"><i class="la la-home nav-icon"></i> {{ trans('backpack::base.dashboard') }}</a></li>
<li class="nav-title">GESTIÓN COMERCIAL</li>
    <li class='nav-item'><a class='nav-link' href='{{ backpack_url('clientes') }}'><i class='nav-icon la la-users'></i> Clientes</a></li>
<li class="nav-title">MAESTROS</li>
<li class="nav-item nav-dropdown"><a class="nav-link nav-dropdown-toggle parent-menu" href="#"><i class="nav-icon la la-lg la-globe"></i>Localización</a>
    <ul class="nav-dropdown-items">
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('paises') }}'><i class='nav-icon la la-flag'></i> Países</a></li>
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('departamentos') }}'><i class='nav-icon la la-map'></i> Departamentos</a></li>
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('ciudades') }}'><i class='nav-icon la la-map-marker'></i> Ciudades</a></li>
    </ul>
</li>
<li class="nav-item nav-dropdown"><a class="nav-link nav-dropdown-toggle parent-menu" href="#"><i class="nav-icon la la-lg la-institution"></i>Entidad</a>
    <ul class="nav-dropdown-items">
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('parametros') }}'><i class='nav-icon la la-cogs'></i> Parámetros</a></li>
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('oficinas') }}'><i class='nav-icon la la-building'></i> Oficinas</a></li>
    </ul>
</li>