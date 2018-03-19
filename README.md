# clientside-model-manager


data_manager should:
    - READ:
        - be able to retreive all
        - be able to retreive by parameters
            - e.g., "WHERE"
            - see sequelize for example
    - CACHE:
        - cache every object uniquely
        - be able to update all elements of cache
            - may need to record "retreive where" statements in a list, purge that cache, then ask db for data again
