class FixAndRideApp {
  constructor() {
    this.MAP_CONFIG = {
      center: [20.58806, -100.38806], // Coordenadas de Querétaro
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      tileLayers: {
        standard: {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        dark: {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        },
        satellite: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }
      },
      iconColors: {
        default: '#27ae60', // Color principal de tu marca
        emergency: '#e74c3c' // Color para emergencias
      }
    };

    this.init();
  }

  init() {
    this.initSmoothScroll();
    this.initHamburgerMenu();
    this.initNavbarScrollEffect();
    this.initScrollAnimations();
    this.initFormValidation();
    this.initCopyrightYear();
    this.initMap();
    this.initWhatsAppButton();
    this.addServiceWorker();
  }

  initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor || anchor.getAttribute('href') === '#') return;

      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        
        history.pushState(null, null, anchor.getAttribute('href'));
      }
    });
  }

  initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('#navbar ul');

    if (!hamburger || !navLinks) return;

    const toggleMenu = () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.classList.toggle('no-scroll', navLinks.classList.contains('active'));
    };

    hamburger.addEventListener('click', toggleMenu);

    
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  initNavbarScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScrollY = window.scrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });

    
    updateNavbar();
  }

  initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.servicio, .section-title, .equipo-container, .testimonio, .contacto-container'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          
          if (entry.target.classList.contains('servicio')) {
            const delay = entry.target.dataset.service * 0.1;
            entry.target.style.transitionDelay = `${delay}s`;
          }
        }
      });
    }, { threshold: 0.15 });

    animatedElements.forEach(el => {
      el.classList.add('will-animate');
      observer.observe(el);
    });
  }

  initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    this.ensureModalExists();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      this.clearValidationErrors();
      
      const isValid = this.validateForm(form);
      if (!isValid) return;

      try {
        const formData = this.getFormData(form);
        console.log('Formulario enviado:', formData);
        
	  
        
        this.showModal();
        
        
        setTimeout(() => form.reset(), 500);
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        this.showModal('Error al enviar el mensaje. Por favor intenta nuevamente.', true);
      }
    });

    
    document.addEventListener('click', (e) => {
      if (e.target.matches('.close-modal, .modal-btn, .modal')) {
        this.hideModal();
      }
    });

    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.hideModal();
    });
  }

  showValidationError(msg, fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const error = document.createElement('div');
    error.className = 'validation-error';
    error.textContent = msg;
    field.parentNode.insertBefore(error, field.nextSibling);
    field.style.borderColor = '#e74c3c';
    field.focus();

    
    setTimeout(() => {
      error.remove();
      field.style.borderColor = '';
    }, 3000);
  }

  clearValidationErrors() {
    document.querySelectorAll('.validation-error').forEach(el => el.remove());
  }

  validateForm(form) {
    let isValid = true;

    
    const name = form.name.value.trim();
    if (!name) {
      this.showValidationError('Por favor ingresa tu nombre', 'name');
      isValid = false;
    }

    
    const email = form.email.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showValidationError('Por favor ingresa un email válido', 'email');
      isValid = false;
    }

    
    const phone = form.phone.value.trim();
    if (!phone) {
      this.showValidationError('Por favor ingresa tu teléfono', 'phone');
      isValid = false;
    }

    
    const message = form.message.value.trim();
    if (!message) {
      this.showValidationError('Por favor ingresa un mensaje', 'message');
      isValid = false;
    }

    return isValid;
  }

  getFormData(form) {
    return {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      date: new Date().toISOString()
    };
  }

  ensureModalExists() {
    if (document.querySelector('.modal')) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-icon"></div>
        <h3></h3>
        <p></p>
        <button class="btn modal-btn">Aceptar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showModal(message = null, isError = false) {
    const modal = document.querySelector('.modal');
    if (!modal) return;

    const icon = isError ? '❌' : '✅';
    const title = isError ? 'Error' : '¡Gracias!';
    
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${message || 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.'}</p>
        <button class="btn modal-btn">Aceptar</button>
      </div>
    `;
    
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    
    setTimeout(() => {
      const btn = modal.querySelector('.modal-btn');
      if (btn) btn.focus();
    }, 100);
  }

  hideModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  initCopyrightYear() {
    const el = document.querySelector('.copyright');
    if (el) {
      el.textContent = el.textContent.replace(/20\d{2}/, new Date().getFullYear());
    }
  }

  initMap() {
    const mapEl = document.getElementById('mapa-cobertura');
    if (!mapEl) {
      console.error('Elemento del mapa no encontrado');
      return;
    }

    
    mapEl.style.height = '500px';
    
 
    const map = L.map('mapa-cobertura', {
      center: this.MAP_CONFIG.center,
      zoom: this.MAP_CONFIG.zoom,
      minZoom: this.MAP_CONFIG.minZoom,
      maxZoom: this.MAP_CONFIG.maxZoom,
      scrollWheelZoom: true
    });

    
    const baseLayers = {
      "Mapa Estándar": L.tileLayer(this.MAP_CONFIG.tileLayers.standard.url, {
        attribution: this.MAP_CONFIG.tileLayers.standard.attribution
      }),
      "Mapa Oscuro": L.tileLayer(this.MAP_CONFIG.tileLayers.dark.url, {
        attribution: this.MAP_CONFIG.tileLayers.dark.attribution
      }),
      "Satélite": L.tileLayer(this.MAP_CONFIG.tileLayers.satellite.url, {
        attribution: this.MAP_CONFIG.tileLayers.satellite.attribution
      })
    };

    
    baseLayers["Mapa Estándar"].addTo(map);

    
    const coveragePoints = [
      {name: "Centro Histórico", coords: [20.593333, -100.392778], time: "15 min"},
      {name: "Juriquilla", coords: [20.700000, -100.450000], time: "20 min"},
      {name: "El Marqués", coords: [20.740278, -100.261389], time: "25 min"},
      {name: "Corregidora", coords: [20.531944, -100.441944], time: "20 min"},
      {name: "La Cañada", coords: [20.606111, -100.342500], time: "30 min"},
      {name: "San Juan del Río", coords: [20.388889, -100.000000], time: "35 min"},
      {name: "Cerro de las Campanas", coords: [20.598889, -100.401111], time: "15 min"},
      {name: "Paseo de la República", coords: [20.585000, -100.388611], time: "10 min"},
      {name: "Zibatá", coords: [20.645833, -100.390833], time: "22 min"},
      {name: "Milénio", coords: [20.570000, -100.400000], time: "12 min"},
      {name: "Santa Rosa Jáuregui", coords: [20.741667, -100.448611], time: "28 min"},
      {name: "Tequisquiapan", coords: [20.516667, -99.883333], time: "45 min"},
      {name: "Bernal", coords: [20.740000, -99.941667], time: "40 min"},
      {name: "Aeropuerto", coords: [20.617500, -100.185833], time: "25 min"},
      {name: "Plaza Antea", coords: [20.618056, -100.402778], time: "18 min"}
    ];

 
    const bikeIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });


    const markersLayer = L.layerGroup().addTo(map);

 
    coveragePoints.forEach((point, index) => {
      const marker = L.marker(point.coords, {
        icon: bikeIcon,
        riseOnHover: true
      }).addTo(markersLayer);

    
      const popupContent = this.createMapPopupContent(point);
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'map-popup'
      });

      
      setTimeout(() => {
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.style.transition = 'transform 0.3s ease';
          markerElement.style.transform = 'scale(1.2)';
          setTimeout(() => {
            markerElement.style.transform = 'scale(1)';
          }, 300);
        }
      }, index * 150);
    });

  
    map.fitBounds(markersLayer.getBounds().pad(0.2));

    
    L.control.layers(baseLayers, {
      "Puntos de Cobertura": markersLayer
    }, {
      position: 'topright',
      collapsed: false
    }).addTo(map);

    
    const locationInfo = document.createElement('div');
    locationInfo.id = 'location-info-tooltip';
    locationInfo.style.cssText = `
      position: absolute;
      display: none;
      background: white;
      padding: 8px 12px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      pointer-events: none;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
    `;
    document.body.appendChild(locationInfo);

    // Mostrar/ocultar información al pasar el ratón sobre los marcadores
    markersLayer.eachLayer(marker => {
      marker.on('mouseover', (e) => {
        const point = coveragePoints.find(p => 
          p.coords[0] === e.latlng.lat && p.coords[1] === e.latlng.lng
        );
        
        if (point) {
          locationInfo.innerHTML = `
            <strong>${point.name}</strong><br>
            Tiempo estimado: ${point.time}
          `;
          locationInfo.style.display = 'block';
        }
      });

      marker.on('mousemove', (e) => {
        locationInfo.style.top = `${e.originalEvent.pageY - 40}px`;
        locationInfo.style.left = `${e.originalEvent.pageX + 10}px`;
      });

      marker.on('mouseout', () => {
        locationInfo.style.display = 'none';
      });
    });
  }

  createMapPopupContent(point) {
    return `
      <div class="map-popup-content">
        <h4 style="margin-top: 0; margin-bottom: 8px; color: ${this.MAP_CONFIG.iconColors.default}">${point.name}</h4>
        <p style="margin-bottom: 12px;">Tiempo estimado: <strong>${point.time}</strong></p>
        <div style="display: flex; gap: 8px;">
          <a href="https://wa.me/524428223472?text=Hola Fix&Ride, necesito asistencia en ${encodeURIComponent(point.name)}" 
             target="_blank"
             style="
              background-color: ${this.MAP_CONFIG.iconColors.default};
              color: white;
              text-decoration: none;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 5px;
              flex: 1;
             ">
            <i class="fab fa-whatsapp"></i>
            <span>Solicitar</span>
          </a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${point.coords[0]},${point.coords[1]}" 
             target="_blank"
             style="
              background-color: white;
              color: ${this.MAP_CONFIG.iconColors.default};
              border: 1px solid ${this.MAP_CONFIG.iconColors.default};
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 5px;
              flex: 1;
              text-decoration: none;
             ">
            <i class="fas fa-directions"></i>
            <span>Direcciones</span>
          </a>
        </div>
      </div>
    `;
  }

  initWhatsAppButton() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-float, .btn[href*="whatsapp"]');
    
    whatsappButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (window.location.hash === '#contacto') return;
        e.preventDefault();
        window.open(btn.getAttribute('href'), '_blank');
      });
    });
  }

  addServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('ServiceWorker registrado con éxito:', registration.scope);
        }).catch(error => {
          console.log('Error al registrar ServiceWorker:', error);
        });
      });
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new FixAndRideApp();
});