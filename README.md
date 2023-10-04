 ============================> THREEJS <============================
 
 * Сцена
 * Объекты
 * Камера
 * Отрисовщик


# -> Сцена === контейнер, где все хранится, туда будет складывать тени, свет, объекты, камеры и др.


```const scene = new THREE.Scene()```


# -> Объекты - различные объекты, например:

* Примитивная геометрия
* Импортированные 3D модели
* Частицы
* Свет
* and etc


Для создания простого примитивного геометрического куба - нужно создать сущность сетки.


		|-- Геометрия -> const geometry = new THREE.BoxGeometry(width, height, depth)
$ Сетка |   |=> const mesh = new THREE.Mesh(geometry, material) // Сетка - это меш
		|-- Материал  -> const material = new THREE.MeshBasicMaterial({color : '...'})


После создания, нужно добавить на сцену - в наш контейнер, для отрисовки


							```scene.add(mesh)```


# -> Камера : 

* Не видно на странице - все будет видно от лица камеры
* Взгляд на сцену
* Может быть > 1
* Существуют разные виды камер


Перспективная камера воспринимает сцену от угла поля зрения - чем дальше объект - тем он меньше, то есть как в реально жизне - приблежая, мы имеем, большой формат объекта


```
const sizes = {
	width: 600,
	height: 600
}

const camera = new THREE.PerspectiveCamera(fov, aspect, near, fav)
scene.add(camera)
```


# -> Отрисовщик :

* Рендерит сцену от лица камеры
* Результат помещает на canvas
* Использует WebGL


```
const canvas = document.querySelector('canvas') -> если мы не создаем через threejs
const rendered = new THREE.WebGLRenderer({ antialias: true, canvas})

rendered.render(scene, camera)

Чтобы сделать адаптивным - canvas
Задать свойство в css : 

canvas {
	width: 100%;
	height: 100%;
	display: block;
}
```


Также в самой сцене задать функцию, которая при ресайзе - оценивает соотношение (aspect) => {
	```const isResizeWindow = (rendered) => {
		const PixelAspect = window.devicePixelRatio
		
		 const canvas = rendered.domElement;
   		const w = (canvas.clientWidth * pixelRatio) | 0;
   		const h = (canvas.clientHeight * pixelRatio) | 0;

   		const isResize = canvas.width !== w || canvas.height !== h;

   		if (isResize) {
   		  rendered.setSize(w, h, false);
   		}

   		return isResize;
	}

	 if (isResizeWindow(rendered)) {
      const canvas = rendered.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }```

}


Нужно понимать, как работает position - scale и все в этом духе

-----------------------------------------------------------------------------------------------------------------------------------------|=|--------------------------------
Виды преобразований объектов в THREEjs

* position(для перемещения)
* scale(для изменения размера)
* rotation(для вращения)
* quaternion(для более сложного вращения)


Координаты в THREEjs -> 

          /y\
           |
		   |
		   |_______\ x
		  /        /
		 /
		/
	  \z/ - что z -> направлена назад



У position есть полезные фишки, такие как => 

```
// Расстояние вектора
mesh.position.length()

//Расстояние до другого объекта
mesh.position.distanceTo(camera.position)

//Ремасштабирует объект
mesh.position.normalize()

// Задает сразу xyz - корды, вместо прописи в види одиночных корд-т
mesh.position.set(x, y, z)

```

```
// Выведет координатные плоскости, то есть график x y z
const axesHelper = new THREE.AxesHelper(3);
```


При scale можно выводить значения в отрицательное значение , но приведет к ошибке, по скольку оси не будут орентированы в логическом направление

# Вращение - rotation | quaternion

x - y - z, представлены не от vector3 , а от класса auler

Суть делается центр, где совпадает центр меша, и производится вращение относительно 1го центра
||||||||||||||||||||||||||||||||||||||
Вращение не по градусам, а по радианам

Также можно сменить преобразование осей - при помощи mesh.rotation.reorder('YZX')

Проблему очередности вращений решает - quaternion (x,y,z,w)
1. У quaternion работает математика с чудесами матричных преобразований
2. Изменяя свойство rotation - также будем изменять свойство quaternion

Метод lookAt
К примеру у camera : 
	camera.lookAt(new THREE.Vector3(0, -1, 0))

Комбинирование преобразований
	То есть комбинировать как state объект => 
		mesh.rotation.x = -1
		mesh.rotation.y = 2
		mesh.rotation.z = 0.5

		mesh.scale.z = 2
		mesh.scale.x = 1
		mesh.scale.y = 1

Чтобы не масштабировать все по отдельности - просто создать объект - mesh'ей, и этот объект scale'ить'

Для этого и приходит const group = new THREE.Group()

|//////////////////////////////////////////////////|
|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|

```
const mesh1 = new THREE.Mesh(geometry, material)
const mesh2 = new THREE.Mesh(geometry, material)
const mesh3 = new THREE.Mesh(geometry, material)

group.add(mesh1)
group.add(mesh2)
group.add(mesh3)

scene.add(group)
```

А теперь можно масштабировать эту группу, чтобы менять все scale - кубов, мешей

----------------------------------|==> Анимации <==|----------------------------------------------------------------------------
Чтобы сделать анимацию нужно создать функцию , где будет вызываться requestAnimationFrame, в эту функцию, чтобы было все видно, мы должно дописать rendered.render(scene, camera). Отсюда и следует беда, такая как, чем больше Gz , тем быстрее будет анимация двигаться, а чем меньше Gz = тем медленее будет идти анимация


========>|Code|<=======

```

 const timeRender = (time) => {

   const alapsedTime = clock.getElapsedTime();
   time *= 0.001;

   if (resizeWindowUpdate(rendered)) {
     const canvas = rendered.domElement;
     camera.aspect = canvas.clientWidth / canvas.clientHeight;

     camera.updateProjectionMatrix();
   }

   cubes.forEach((box, ndx) => {

     const speed = 1 + ndx * 0.001;
     const rot = time * speed;

     box.rotation.reorder("ZXY");

     box.rotation.x = rot;
     box.rotation.y = rot;

     camera.position.x = Math.cos(rot);
     camera.position.y = Math.sin(rot);

     camera.lookAt(box.position);

   });

   rendered.render(scene, camera); // И да обязательно, в таких функциях анимация вызывать стейт рендера, т.к. из вне он не видет твою функцию, отвечающую за анимацию!
   requestAnimationFrame(timeRender);
 };

 requestAnimationFrame(timeRender);

```

В этом случае не обязательно получать из вне clock - константу, т.к. у меня идет синхронизация с requestAnimationFrame... Где из вне вызов осуществляю, который передает - tick 1 - в 1 мс сек => что у меня time принимает 1 тик и обновляет относительно его

Пример, где можно просто через THREE.Clock() сделать синхронизировано на всех мониках, т.к. чем выше гц - тем быстрее может быть анимация, моим методом requestAnimationFrame(от тика дающего)
Снизу пример кода, по методу реализован Date.now() , с вычетом текущего и прошедшего, тут не асинхроно

```

 let time = Date.now();

 const timeRender = () => {

   const curTime = Date.now();
   const delta = curTime - time;
   time = curTime;

   if (resizeWindowUpdate(rendered)) {
     const canvas = rendered.domElement;
     camera.aspect = canvas.clientWidth / canvas.clientHeight;

     camera.updateProjectionMatrix();
   }

   cubes.forEach((box, ndx) => {

     const speed = 1 + ndx * 0.001;
     const rot = delta * speed;

     box.rotation.reorder("ZXY");

     box.rotation.x = rot;
     box.rotation.y = rot;

     camera.position.x = Math.cos(rot);
     camera.position.y = Math.sin(rot);

     camera.lookAt(box.position);

   });

   rendered.render(scene, camera);

   window.requestAnimationFrame(timeRender);
 };
 

```

Но чтобы не писать вот такие грамоздкие структуры логики анимаций - можно использовать простой с THREE js хук в виде Clock, который считает сколько прошло с анимации

```

	
  const clock = new THREE.Clock();

  const timeRender = (time) => {

    const alapsedTime = clock.getElapsedTime();

    if (resizeWindowUpdate(rendered)) {
      const canvas = rendered.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((box, ndx) => {

      box.rotation.reorder("ZXY");

      box.rotation.x = rot;
      box.rotation.y = rot;

      camera.position.x = Math.cos(alapsedTime);
      camera.position.y = Math.sin(alapsedTime);

      camera.lookAt(box.position);
    });
    rendered.render(scene, camera);

    requestAnimationFrame(timeRender);
  };

  requestAnimationFrame(timeRender);


```


=====================> | camera | <=============================

Для более сложных и крутых сцене
Class Camera extends THREEjs - это абстрактный класс, не должны использовать его напрямую, но вы можете наследовать от него доступ к общим свойствам и методам.

Более редкие камеры:

* ArrayCamera -> используется для многократного рендеринга сцены, с использованием нескольких камер, которая будет отображать определенную область сцены

```
 const cameras = [
  new THREE.PerspectiveCamera(fov, aspect, near, fav),
  new THREE.PerspectiveCamera(fov, aspect, near, fav)
 ]

 const camera = new THREE.ArrayCamera(cameras)
```

* StereoCamera -> Используется для рендеринга сцены с помощью двух камер, с использованием будето наших глаз - создавая паралакс, о чем символизирует наш мозг при этом, что мы создаем глубину какую-то. Но минус, нужно либо иметь VR, либо похожее на него

```
  const camera = new THREE.StereoCamera()

  const leftCamera = camera.cameraL
  const rightCamera = camera.cameraR

  leftCamera.position.set(x, y, z)
  rightCamera.position.set(x, y, z)

  leftCamera.focalLength = 10
  rightCamera.focalLength = 10
```

Для рендера этой камеры -> 
```
  camera.update(rendered, scene)

  rendered.setRenderTarget(rendered.getRenderTarget().left)
  rendered.render(scene, leftCamera)

  rendered.setRenderTarget(rendered.getRenderTarget().right)
  rendered.render(scene, rightCamera)

  rendered.setRenderTarget(null)
```

* CubeCamera -> Используется для получения рендеринг в некоторых направлениях, создает рендеринг окружения. Карта теней

```
  const cubeCamera = new THREE.CubeCamera(near, far, resolution)
  cubeCamera.position.set(x, y, z)

  scene.add(cubeCamera)
  cubeCamera.update(rendered, scene)
```

//Более частые камеры

* OrthographicCamera -> для рендеринга без перспектив, без размеров

'/three-docs-ru/assets/camera/OrthographicCamera${i*3}'
                             /\
приложение, что за параметры ||


```
  const camera = new THREE.OrthographicCamera(
    left,
    right,
    top,
    bottom,
    near,
    far
  )
```

* PerspectiveCamera -> для рендеринга с перспективами, учитывая размеры

'/three-docs-ru/assets/camera/OrthographicCamera${i*2}'
                             /\
приложение, что за параметры ||

Чем меньше угол обзора = тем худше качество, то есть больше искоженно. В среднем от 45 до 75

```
  const camera = new THREE.PerspectiveCamera(
    fov,
    aspect,
    near,
    far
  )

```
