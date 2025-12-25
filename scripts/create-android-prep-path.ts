import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const androidPrepPath = {
  title: 'Android Development Interview Prep',
  description: 'Comprehensive guide to ace Android development interviews. Covering fundamentals, architecture, UI/UX, performance, and advanced topics.',
  icon: '🤖',
  color: '#3DDC84',
  category: 'android',
  difficulty: 'intermediate',
  estimated_time: '2-3 months',
  published: true,
  order: 0,
}

const topics = [
  {
    title: 'Android Fundamentals',
    description: 'Core Android concepts, Activity lifecycle, Fragments, Intents, and basic components',
    order: 1,
    questions: [
      {
        question: 'Explain the Android Activity lifecycle. What happens in each callback method?',
        answer: `The Activity lifecycle consists of several callback methods that are called as the activity transitions through different states:

1. **onCreate()**: Called when the activity is first created. Initialize UI components, set content view, and restore saved state.

2. **onStart()**: Called when the activity becomes visible to the user. The activity is not yet interactive.

3. **onResume()**: Called when the activity starts interacting with the user. This is where you should start animations, camera, or other foreground-only features.

4. **onPause()**: Called when the system is about to resume another activity. Save data, stop animations, and release resources that shouldn't run while paused.

5. **onStop()**: Called when the activity is no longer visible. The activity may be destroyed or another activity may come on top.

6. **onRestart()**: Called after onStop() when the activity is being restarted.

7. **onDestroy()**: Called before the activity is destroyed. This is the final call.`,
        difficulty: 'medium',
        tags: ['activity', 'lifecycle', 'fundamentals'],
      },
      {
        question: 'What is the difference between Activity and Fragment?',
        answer: `**Activity:**
- Represents a single screen with a user interface
- Must be declared in AndroidManifest.xml
- Has its own lifecycle
- Can exist independently

**Fragment:**
- Represents a portion of UI in an Activity
- Reusable and modular
- Has its own lifecycle but is tied to host Activity
- Cannot exist without an Activity
- Better for responsive UIs (tablets, different screen sizes)

**When to use:**
- Use Activity for full-screen UI or when you need a separate entry point
- Use Fragment for reusable UI components, responsive layouts, or when you need multiple UI sections in one screen`,
        difficulty: 'medium',
        tags: ['activity', 'fragment', 'ui'],
      },
      {
        question: 'Explain Intent and its types. When would you use each?',
        answer: `**Intent** is a messaging object used to request an action from another app component.

**Types:**

1. **Explicit Intent**: Specifies the exact component to start
   - Use when starting components within your own app
   - Example: Starting a specific Activity in your app

2. **Implicit Intent**: Declares a general action to perform
   - Use when you want other apps to handle the action
   - Example: Opening a URL, sharing content, taking a photo

**Common Intent Actions:**
- ACTION_VIEW: Display data
- ACTION_SEND: Send data
- ACTION_DIAL: Open dialer
- ACTION_CALL: Make a phone call (requires permission)`,
        difficulty: 'easy',
        tags: ['intent', 'navigation', 'fundamentals'],
      },
      {
        question: 'What is the difference between Serializable and Parcelable?',
        answer: `**Serializable:**
- Java interface, easier to implement
- Uses reflection, slower performance
- Creates many temporary objects (GC overhead)
- Simple: just implement Serializable interface

**Parcelable:**
- Android-specific interface
- Much faster (no reflection)
- Explicit serialization (writeToParcel)
- More boilerplate code
- Recommended for Android

**Best Practice:** Use Parcelable for passing data between Activities/Fragments in Android for better performance.`,
        difficulty: 'medium',
        tags: ['parcelable', 'serializable', 'performance'],
      },
    ],
  },
  {
    title: 'UI/UX and Views',
    description: 'Layouts, Views, RecyclerView, Custom Views, Material Design, and UI best practices',
    order: 2,
    questions: [
      {
        question: 'Explain RecyclerView vs ListView. Why is RecyclerView preferred?',
        answer: `**ListView:**
- Older component, simpler API
- Limited customization
- Less efficient view recycling
- Built-in dividers and selection modes

**RecyclerView:**
- Modern, flexible, and performant
- Better view recycling (ViewHolder pattern enforced)
- LayoutManager abstraction (Linear, Grid, Staggered)
- ItemDecoration, ItemAnimator for customizations
- No built-in click listeners (more flexible)

**Why RecyclerView is preferred:**
- Better performance with large datasets
- More flexible layouts
- Better separation of concerns
- Active development and support`,
        difficulty: 'medium',
        tags: ['recyclerview', 'listview', 'ui', 'performance'],
      },
      {
        question: 'What is ViewHolder pattern? Why is it important?',
        answer: `**ViewHolder Pattern:**
A design pattern that holds references to View objects to avoid repeated findViewById() calls.

**Benefits:**
1. **Performance**: findViewById() is expensive. ViewHolder caches references
2. **Memory**: Reduces object creation
3. **Smooth Scrolling**: Faster binding in onBindViewHolder()

**Implementation:**
\`\`\`kotlin
class MyViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    val title: TextView = itemView.findViewById(R.id.title)
    val subtitle: TextView = itemView.findViewById(R.id.subtitle)
}
\`\`\`

**Best Practice:** Always use ViewHolder pattern in RecyclerView adapters.`,
        difficulty: 'easy',
        tags: ['viewholder', 'recyclerview', 'performance', 'pattern'],
      },
      {
        question: 'Explain ConstraintLayout and its advantages over other layouts.',
        answer: `**ConstraintLayout:**
A flexible layout that allows you to create complex layouts with a flat view hierarchy.

**Advantages:**
1. **Flat Hierarchy**: Reduces nested views (better performance)
2. **Flexible Positioning**: Relative positioning, chains, barriers
3. **Powerful Constraints**: Can create responsive layouts easily
4. **Performance**: Faster rendering than nested layouts
5. **Design Tools**: Better support in Android Studio Layout Editor

**Key Features:**
- Relative positioning (to parent, siblings, guidelines)
- Chains: Distribute space evenly
- Barriers: Align multiple views
- Groups: Show/hide multiple views together
- Circular positioning: Position views in a circle

**When to use:**
- Complex layouts that would require deep nesting
- Responsive designs
- When performance matters`,
        difficulty: 'medium',
        tags: ['constraintlayout', 'ui', 'layout', 'performance'],
      },
      {
        question: 'What is Material Design? How do you implement it in Android?',
        answer: `**Material Design:**
Google's design language that provides guidelines for visual, motion, and interaction design.

**Key Principles:**
- Material metaphor (paper-like surfaces)
- Bold, graphic, intentional
- Motion provides meaning
- Adaptive design

**Implementation:**
1. **Material Components Library**: Use Material Design components
2. **Themes**: Apply Material themes
3. **Colors**: Use Material color system
4. **Typography**: Material type scale
5. **Elevation**: Use elevation for depth
6. **Animations**: Material motion principles

**Example:**
\`\`\`kotlin
// Add dependency
implementation 'com.google.android.material:material:1.9.0'

// Use Material components
<com.google.android.material.button.MaterialButton />
\`\`\``,
        difficulty: 'easy',
        tags: ['material-design', 'ui', 'design'],
      },
    ],
  },
  {
    title: 'Architecture and Design Patterns',
    description: 'MVVM, MVP, MVI, Clean Architecture, Repository pattern, and architectural best practices',
    order: 3,
    questions: [
      {
        question: 'Explain MVVM architecture in Android. What are the key components?',
        answer: `**MVVM (Model-View-ViewModel):**
An architectural pattern that separates UI logic from business logic.

**Components:**

1. **Model**: Data layer (database, network, repositories)
2. **View**: UI components (Activity, Fragment, XML)
3. **ViewModel**: Holds UI-related data, survives configuration changes

**Key Features:**
- ViewModel survives configuration changes
- LiveData/Flow for reactive data
- Data binding support
- Separation of concerns
- Testable architecture

**Example Flow:**
View → ViewModel → Repository → Data Source
View ← ViewModel ← Repository ← Data Source

**Benefits:**
- Testable business logic
- No memory leaks (ViewModel doesn't hold View reference)
- Configuration change handling
- Clear separation of concerns`,
        difficulty: 'medium',
        tags: ['mvvm', 'architecture', 'viewmodel', 'livedata'],
      },
      {
        question: 'What is LiveData? How does it differ from RxJava or Kotlin Flow?',
        answer: `**LiveData:**
Android's lifecycle-aware observable data holder.

**Characteristics:**
- Lifecycle-aware (automatically stops updates when inactive)
- Observer pattern
- Main thread only
- Simple API
- Built-in null safety

**LiveData vs RxJava:**
- LiveData: Simpler, lifecycle-aware, main thread
- RxJava: More powerful, complex operators, thread management

**LiveData vs Flow:**
- LiveData: Android-specific, lifecycle-aware
- Flow: Kotlin coroutines, more flexible, can work on any thread

**When to use:**
- LiveData: Simple UI updates, lifecycle-aware needs
- Flow: Complex data streams, coroutines integration
- RxJava: Complex reactive programming needs`,
        difficulty: 'medium',
        tags: ['livedata', 'flow', 'rxjava', 'reactive'],
      },
      {
        question: 'Explain Repository pattern in Android. Why is it important?',
        answer: `**Repository Pattern:**
A design pattern that abstracts data sources and provides a clean API for data access.

**Purpose:**
- Single source of truth
- Abstract data sources (local DB, network, cache)
- Easier testing
- Centralized data logic

**Implementation:**
\`\`\`kotlin
class UserRepository(
    private val localDataSource: UserLocalDataSource,
    private val remoteDataSource: UserRemoteDataSource
) {
    suspend fun getUser(id: String): Flow<User> {
        return flow {
            // Check cache first
            val cached = localDataSource.getUser(id)
            if (cached != null) emit(cached)
            
            // Fetch from network
            val remote = remoteDataSource.getUser(id)
            localDataSource.saveUser(remote)
            emit(remote)
        }
    }
}
\`\`\`

**Benefits:**
- Decouples ViewModel from data sources
- Easy to swap data sources
- Centralized caching logic
- Better testability`,
        difficulty: 'medium',
        tags: ['repository', 'pattern', 'architecture', 'data'],
      },
      {
        question: 'What is Clean Architecture? How do you implement it in Android?',
        answer: `**Clean Architecture:**
An architectural approach that separates code into layers with clear dependencies.

**Layers (outer to inner):**
1. **Presentation**: UI (Activities, Fragments, ViewModels)
2. **Domain**: Business logic (Use cases, Entities)
3. **Data**: Data sources (Repositories, Data sources)

**Principles:**
- Dependency rule: Inner layers don't know about outer layers
- Separation of concerns
- Testability
- Framework independence

**Android Implementation:**
\`\`\`
app/
  presentation/
    ui/
    viewmodel/
  domain/
    usecase/
    repository/
  data/
    repository/
    datasource/
\`\`\`

**Benefits:**
- Testable business logic
- Framework independent
- Easy to maintain
- Clear dependencies`,
        difficulty: 'hard',
        tags: ['clean-architecture', 'architecture', 'design'],
      },
    ],
  },
  {
    title: 'Kotlin and Coroutines',
    description: 'Kotlin language features, Coroutines, Flow, and asynchronous programming',
    order: 4,
    questions: [
      {
        question: 'Explain Kotlin Coroutines. How do they differ from threads?',
        answer: `**Coroutines:**
Lightweight threads for asynchronous programming in Kotlin.

**Key Differences from Threads:**
- **Lightweight**: Thousands of coroutines can run on a few threads
- **Structured Concurrency**: Automatic cancellation and exception handling
- **Suspend Functions**: Non-blocking suspension
- **Context Switching**: Much cheaper than threads

**Basic Usage:**
\`\`\`kotlin
// Launch a coroutine
lifecycleScope.launch {
    val data = fetchData() // suspend function
    updateUI(data)
}

// Suspend function
suspend fun fetchData(): String {
    return withContext(Dispatchers.IO) {
        // Network call
    }
}
\`\`\`

**Dispatchers:**
- Main: UI operations
- IO: Network, file operations
- Default: CPU-intensive work`,
        difficulty: 'medium',
        tags: ['coroutines', 'kotlin', 'async', 'concurrency'],
      },
      {
        question: 'What is Flow in Kotlin? How is it different from LiveData?',
        answer: `**Flow:**
Cold asynchronous data stream in Kotlin Coroutines.

**Characteristics:**
- Cold stream (starts on collection)
- Can emit multiple values over time
- Built on coroutines
- Can work on any dispatcher
- Rich operators (map, filter, transform, etc.)

**Flow vs LiveData:**
- Flow: More flexible, can work on any thread, rich operators
- LiveData: Lifecycle-aware, simpler, main thread only

**Example:**
\`\`\`kotlin
fun getUsers(): Flow<List<User>> = flow {
    while (true) {
        emit(fetchUsers())
        delay(5000) // Emit every 5 seconds
    }
}.flowOn(Dispatchers.IO)

// Collect
lifecycleScope.launch {
    getUsers().collect { users ->
        updateUI(users)
    }
}
\`\`\``,
        difficulty: 'medium',
        tags: ['flow', 'kotlin', 'coroutines', 'reactive'],
      },
      {
        question: 'Explain suspend functions in Kotlin. When and how to use them?',
        answer: `**Suspend Functions:**
Functions that can be paused and resumed, used for asynchronous operations.

**Key Points:**
- Can only be called from coroutines or other suspend functions
- Non-blocking: Doesn't block the thread
- Can use other suspend functions
- Compiler transforms them into state machines

**Usage:**
\`\`\`kotlin
// Suspend function
suspend fun fetchUser(id: String): User {
    return withContext(Dispatchers.IO) {
        api.getUser(id)
    }
}

// Call from coroutine
lifecycleScope.launch {
    val user = fetchUser("123")
    displayUser(user)
}
\`\`\`

**When to use:**
- Network calls
- Database operations
- File I/O
- Any long-running operation
- When you need to wait for a result

**Best Practices:**
- Use suspend for async operations
- Use withContext to switch dispatchers
- Don't block in suspend functions`,
        difficulty: 'medium',
        tags: ['suspend', 'kotlin', 'coroutines', 'async'],
      },
    ],
  },
  {
    title: 'Performance and Optimization',
    description: 'Memory management, performance optimization, profiling, and best practices',
    order: 5,
    questions: [
      {
        question: 'How do you handle memory leaks in Android? What are common causes?',
        answer: `**Common Memory Leak Causes:**

1. **Static References**: Holding references to Activities/Contexts
2. **Inner Classes**: Non-static inner classes holding outer class reference
3. **Listeners**: Not removing listeners (RecyclerView, Location, etc.)
4. **Threads**: Long-running threads holding references
5. **Handlers**: Handler with Activity reference

**Prevention:**
- Use ApplicationContext when possible
- Use WeakReference for callbacks
- Remove listeners in onDestroy()
- Use ViewModel instead of holding Activity reference
- Use LeakCanary for detection

**Example Fix:**
\`\`\`kotlin
// Bad
class MyActivity : AppCompatActivity() {
    private val handler = Handler {
        // Holds Activity reference
    }
}

// Good
class MyActivity : AppCompatActivity() {
    private val handler = Handler(Looper.getMainLooper()) {
        // Use ViewModel for data
    }
}
\`\`\``,
        difficulty: 'medium',
        tags: ['memory', 'leaks', 'performance', 'optimization'],
      },
      {
        question: 'Explain Android app performance optimization techniques.',
        answer: `**Performance Optimization Techniques:**

1. **UI Optimization:**
   - Use ConstraintLayout (flat hierarchy)
   - Implement ViewHolder pattern
   - Use RecyclerView instead of ListView
   - Optimize layouts (avoid overdraw)

2. **Memory:**
   - Use object pooling
   - Avoid memory leaks
   - Use appropriate data structures
   - Release resources properly

3. **Network:**
   - Implement caching
   - Use pagination
   - Compress data
   - Batch requests

4. **Background Work:**
   - Use WorkManager for background tasks
   - Use coroutines for async operations
   - Avoid blocking main thread

5. **Images:**
   - Use image loading libraries (Glide, Coil)
   - Resize images appropriately
   - Use WebP format
   - Implement image caching

6. **Database:**
   - Use Room with proper indexing
   - Implement pagination
   - Use transactions efficiently

**Tools:**
- Android Profiler
- Systrace
- LeakCanary
- StrictMode`,
        difficulty: 'hard',
        tags: ['performance', 'optimization', 'profiling'],
      },
      {
        question: 'What is ProGuard/R8? How do you use it for app optimization?',
        answer: `**ProGuard/R8:**
Code shrinking, obfuscation, and optimization tool for Android.

**Features:**
1. **Code Shrinking**: Removes unused code
2. **Resource Shrinking**: Removes unused resources
3. **Obfuscation**: Renames classes/methods (smaller APK, harder to reverse)
4. **Optimization**: Optimizes bytecode

**Configuration:**
\`\`\`gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'),
                         'proguard-rules.pro'
        }
    }
}
\`\`\`

**ProGuard Rules:**
- Keep classes used by reflection
- Keep Parcelable implementations
- Keep native methods
- Keep classes referenced in AndroidManifest

**Benefits:**
- Smaller APK size
- Better performance
- Code obfuscation (security)
- Faster app startup`,
        difficulty: 'medium',
        tags: ['proguard', 'r8', 'optimization', 'build'],
      },
    ],
  },
  {
    title: 'Networking and APIs',
    description: 'Retrofit, OkHttp, REST APIs, JSON parsing, and network best practices',
    order: 6,
    questions: [
      {
        question: 'Explain Retrofit in Android. How do you set it up and use it?',
        answer: `**Retrofit:**
Type-safe HTTP client for Android and Java.

**Setup:**
\`\`\`gradle
implementation 'com.squareup.retrofit2:retrofit:2.9.0'
implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
\`\`\`

**Usage:**
\`\`\`kotlin
// Define API interface
interface ApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: String): User
    
    @POST("users")
    suspend fun createUser(@Body user: User): Response<User>
}

// Create Retrofit instance
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val apiService = retrofit.create(ApiService::class.java)

// Use in coroutine
lifecycleScope.launch {
    val user = apiService.getUser("123")
}
\`\`\`

**Features:**
- Type-safe
- Supports coroutines
- Easy to test
- Interceptors support
- Multiple converters (Gson, Moshi, etc.)`,
        difficulty: 'medium',
        tags: ['retrofit', 'networking', 'api', 'http'],
      },
      {
        question: 'How do you handle API errors and retries in Android?',
        answer: `**Error Handling Strategies:**

1. **Try-Catch with Result Wrapper:**
\`\`\`kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
}

suspend fun fetchUser(id: String): Result<User> {
    return try {
        Result.Success(apiService.getUser(id))
    } catch (e: Exception) {
        Result.Error(e)
    }
}
\`\`\`

2. **Retrofit with Response Wrapper:**
\`\`\`kotlin
@GET("users/{id}")
suspend fun getUser(@Path("id") id: String): Response<User>

// Check response
if (response.isSuccessful) {
    val user = response.body()
} else {
    // Handle error
}
\`\`\`

3. **Retry with Exponential Backoff:**
\`\`\`kotlin
suspend fun fetchWithRetry(maxRetries: Int = 3): User {
    repeat(maxRetries) { attempt ->
        try {
            return apiService.getUser("123")
        } catch (e: Exception) {
            if (attempt == maxRetries - 1) throw e
            delay(1000L * (attempt + 1)) // Exponential backoff
        }
    }
    throw Exception("Failed after retries")
}
\`\`\``,
        difficulty: 'medium',
        tags: ['networking', 'error-handling', 'retry', 'api'],
      },
    ],
  },
]

const generalResources = [
  {
    title: 'Android Developer Documentation',
    type: 'documentation',
    url: 'https://developer.android.com',
    description: 'Official Android development documentation',
    order: 1,
  },
  {
    title: 'Android Kotlin Fundamentals',
    type: 'course',
    url: 'https://developer.android.com/courses/android-basics-kotlin/course',
    description: 'Google\'s official Kotlin course for Android',
    order: 2,
  },
  {
    title: 'Android Architecture Components',
    type: 'documentation',
    url: 'https://developer.android.com/topic/libraries/architecture',
    description: 'Guide to Android Architecture Components',
    order: 3,
  },
]

async function createAndroidPrepPath() {
  try {
    console.log('Creating Android prep path...')

    // Create prep path
    const { data: pathData, error: pathError } = await supabase
      .from('prep_paths')
      .insert(androidPrepPath)
      .select()
      .single()

    if (pathError) {
      if (pathError.code === '23505') {
        console.log('Prep path already exists, fetching existing...')
        const { data: existing } = await supabase
          .from('prep_paths')
          .select()
          .eq('title', androidPrepPath.title)
          .single()
        
        if (existing) {
          console.log('Using existing prep path:', existing.id)
          await createTopicsAndContent(existing.id)
          return
        }
      }
      throw pathError
    }

    console.log('Prep path created:', pathData.id)

    // Create topics and content
    await createTopicsAndContent(pathData.id)

    // Create general resources
    for (const resource of generalResources) {
      const { error } = await supabase
        .from('prep_resources')
        .insert({
          prep_path_id: pathData.id,
          ...resource,
        })

      if (error) {
        console.error('Error creating resource:', error)
      }
    }

    console.log('✅ Android prep path created successfully!')
  } catch (error) {
    console.error('Error creating Android prep path:', error)
    throw error
  }
}

async function createTopicsAndContent(pathId: string) {
  for (const topic of topics) {
    // Create topic
    const { data: topicData, error: topicError } = await supabase
      .from('prep_topics')
      .insert({
        prep_path_id: pathId,
        title: topic.title,
        description: topic.description,
        order: topic.order,
      })
      .select()
      .single()

    if (topicError) {
      console.error('Error creating topic:', topicError)
      continue
    }

    console.log(`Created topic: ${topic.title}`)

    // Create questions
    for (const question of topic.questions) {
      const { error: questionError } = await supabase
        .from('prep_questions')
        .insert({
          prep_topic_id: topicData.id,
          question: question.question,
          answer: question.answer,
          difficulty: question.difficulty,
          tags: question.tags,
          order: topic.questions.indexOf(question),
        })

      if (questionError) {
        console.error('Error creating question:', questionError)
      }
    }

    console.log(`  Created ${topic.questions.length} questions`)
  }
}

createAndroidPrepPath()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed:', error)
    process.exit(1)
  })

