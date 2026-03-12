import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Register from '../views/Register.vue'
import Home from '@/views/Home.vue'
import Portal from '@/views/Portal.vue'
import Consulta from '@/views/Consulta.vue'
import MinhasConsultas from '@/views/MinhasConsultas.vue'

const routes = [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {requiresAuth: true, cargo: 'SECRETARIO'}
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/portal',
      name: 'portal',
      component: Portal,
      meta: {requiresAuth: true, cargo: 'PACIENTE'},
      children: [
        {
    
          path: 'consulta',
          name: 'consulta',
          component: Consulta
        },
        {
          path: "minhas-consultas",
          name: "minhas-consultas",
          component: MinhasConsultas
        }
      ]
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const cargo = localStorage.getItem('cargo')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.cargo && to.meta.cargo !== cargo) {
    next('/') 
  } else {
    next() 
  }
})

export default router
